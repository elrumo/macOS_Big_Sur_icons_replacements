#!/usr/bin/perl

# use 'swaks --help' to view documentation for this program
#
#      Homepage: http://jetmore.org/john/code/swaks/
#   Online Docs: http://jetmore.org/john/code/swaks/latest/doc/ref.txt
#                http://jetmore.org/john/code/swaks/faq.html
# Announce List: send mail to updates-swaks@jetmore.net
#   Project RSS: http://jetmore.org/john/blog/c/swaks/feed/
#       Google+: https://plus.google.com/u/0/110270727761256449657
#       Twitter: http://www.twitter.com/SwaksSMTP

use strict;

$|            = 1;
my($p_name)   = $0 =~ m|/?([^/]+)$|;
my $p_version = build_version("20130209.0", '$Id: swaks 332 2013-02-09 19:39:32Z jetmore $');
my $p_usage   = "Usage: $p_name [--help|--version] (see --help for details)";
my $p_cp      = <<'EOM';
        Copyright (c) 2003-2008,2010-2013 John Jetmore <jj33@pobox.com>

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA.
EOM

# before we do anything else, check for --help
ext_usage();

# Get all input provided to our program, via file, env, command line, etc
my %O = %{ load_args() };

# Get our functional dependencies and then print and exit early if requested
load_dependencies();
if ($O{get_support}) {
	test_support();
	exit(0);
}

# This 'synthetic' command line used for debug and reference
$G::cmdline = reconstruct_options(\%O);

# We need to fix things up a bit and set a couple of global options
my $opts = process_args(\%O);

if ($G::dump_args) {
	test_support();
	print "\n";

	my $running_state = get_running_state($opts);
	# --dump is intended as a debug tool for swaks internally.  Always,
	# unconditionally, show the user's auth password if one is given
	$running_state =~ s%'PROVIDED_BUT_REMOVED'%shquote($opts->{a_pass})%ge;
	print $running_state;
	print "\nDATA Info:\n"
	   .  "  data = <<.\n$opts->{data}\n";
	exit(0);
}

# we're going to abstract away the actual connection layer from the mail
# process, so move the act of connecting into its own sub.  The sub will
# set info in global hash %G::link
# XXX instead of passing raw data, have processs_opts create a link_data
# XXX hash that we can pass verbatim here
open_link();

sendmail($opts->{from}, $opts->{to}, $opts->{helo}, $opts->{data},
         $opts->{a_user}, $opts->{a_pass}, $opts->{a_type});

teardown_link();

exit(0);

sub teardown_link {
	if ($G::link{type} eq 'socket-inet' || $G::link{type} eq 'socket-unix') {
		# XXX need anything special for tls teardown?
		close($G::link{sock});
		ptrans(11,  "Connection closed with remote host.");
	} elsif ($G::link{type} eq 'pipe') {
		delete($SIG{PIPE});
		$SIG{CHLD} = 'IGNORE';
		close($G::link{sock}{wr});
		close($G::link{sock}{re});
		ptrans(11,  "Connection closed with child process.");
	}
}

sub open_link {
	if ($G::link{type} eq 'socket-inet') {
		ptrans(11, "Trying $G::link{server}:$G::link{port}...");
		$@ = "";
		
		my @extra_options = ();
		push(@extra_options, "LocalAddr", $G::link{lint})  if ($G::link{lint});
		push(@extra_options, "LocalPort", $G::link{lport}) if ($G::link{lport});
		
		# INET6 also support v4, so use it for everything if it's available.  That
		# allows the module to handle A vs AAAA records on domain lookups where te
		# user hasn't set a specific ip version to be used.  If INET6 isn't available
		# and it's a domain that only has AAAA records, INET will just handle it like
		# a bogus record and we just won't be able to connect
		if (avail("ipv6")) {
			if ($G::link{force_ipv6}) {
				push(@extra_options, "Domain", Socket::AF_INET6() );
			} elsif ($G::link{force_ipv4}) {
				push(@extra_options, "Domain", Socket::AF_INET() );
			}
			
			$G::link{sock} = IO::Socket::INET6->new(
				PeerAddr  => $G::link{server},
				PeerPort  => $G::link{port},
				Proto     => 'tcp',
				Timeout   => $G::link{timeout},
				@extra_options
			);
		} else {
			$G::link{sock} = IO::Socket::INET->new(
				PeerAddr  => $G::link{server},
				PeerPort  => $G::link{port},
				Proto     => 'tcp',
				Timeout   => $G::link{timeout},
				@extra_options
			);
		}
		
		if ($@) {
			ptrans(12, "Error connecting" . ($G::link{lint} ? " $G::link{lint}" : '') .
			           " to $G::link{server}:$G::link{port}:\n\t$@");
			exit(2);
		}
		ptrans(11, "Connected to $G::link{server}.");
	} elsif ($G::link{type} eq 'socket-unix') {
		ptrans(11, "Trying $G::link{sockfile}...");
		$SIG{PIPE} = 'IGNORE';
		$@ = "";
		$G::link{sock} = IO::Socket::UNIX->new(Peer => $G::link{sockfile}, Timeout => $G::link{timeout});
		
		if ($@) {
			ptrans(12, "Error connecting to $G::link{sockfile}:\n\t$@");
			exit(2);
		}
		ptrans(11, "Connected to $G::link{sockfile}.");
	} elsif ($G::link{type} eq 'pipe') {
		$SIG{PIPE} = 'IGNORE';
		$SIG{CHLD} = 'IGNORE';
		ptrans(11, "Trying pipe to $G::link{process}...");
		eval{ open2($G::link{sock}{re}, $G::link{sock}{wr}, $G::link{process}); };
		
		if ($@) {
			ptrans(12, "Error connecting to $G::link{process}:\n\t$@");
			exit(2);
		}
		select((select($G::link{sock}{wr}), $| = 1)[0]);
		select((select($G::link{sock}{re}), $| = 1)[0]);
		ptrans(11, "Connected to $G::link{process}.");
	} else {
		ptrans(12, "Unknown or unimplemented connection type $G::link{type}");
		exit(3);
	}
}

sub sendmail {
	my $from    = shift; # envelope-from
	my $to      = shift; # envelope-to
	my $helo    = shift; # who am I?
	my $data    = shift; # body of message (content after DATA command)
	my $a_user  = shift; # what user to auth with?
	my $a_pass  = shift; # what pass to auth with
	my $a_type  = shift; # what kind of auth (this must be set to to attempt)
	my $ehlo    = {};    # If server is esmtp, save advertised features here

	# start up tls if -tlsc specified
	if ($G::tls_on_connect) {
		if (start_tls()) {
			tls_post_start();
			# QUIT here if the user has asked us to do so
			do_smtp_quit(1, 0) if ($G::quit_after eq 'tls');
		} else {
			ptrans(12, "TLS startup failed ($G::link{tls}{res})");
			exit(29);
		}
	}

	# read the server's 220 banner
	do_smtp_gen(undef, '220') || do_smtp_quit(1, 21);

	# QUIT here if the user has asked us to do so
	do_smtp_quit(1, 0) if ($G::quit_after eq 'connect');

	# Send a HELO string
	do_smtp_helo($helo, $ehlo, $G::protocol) || do_smtp_quit(1, 22);

	# QUIT here if the user has asked us to do so
	do_smtp_quit(1, 0) if ($G::quit_after eq 'first-helo');

	if ($G::xclient{try}) {
		# 0 - xclient succeeded normally
		# 1 - xclient not advertised
		# 2 - xclient advertised but not attempted, mismatch in requested attrs
		# 3 - xclient attempted but did not succeed
		my $result = do_smtp_xclient($ehlo);
		if ($result == 1) {
			ptrans(12, "Host did not advertise XCLIENT");
			do_smtp_quit(1, 33) if (!$G::xclient{optional});
		} elsif ($result == 2) {
			ptrans(12, "Host did not advertise requested XCLIENT attributes");
			do_smtp_quit(1, 33) if (!$G::xclient{optional});
		} elsif ($result == 3) {
			ptrans(12, "XCLIENT attempted but failed.  Exiting");
			do_smtp_quit(1, 33) if ($G::xclient{optional} != 1);
		} else {
			do_smtp_quit(1, 0) if ($G::quit_after eq 'xclient');
			
			# re-helo if the XCLIENT command succeeded
			do_smtp_helo($helo, $ehlo, $G::protocol) || do_smtp_quit(1, 34);
			do_smtp_quit(1, 0) if ($G::quit_after eq 'helo');
		}
	}

	# handle TLS here if user has requested it
	if ($G::tls) {
		# 0 = tls succeeded
		# 1 = tls not advertised
		# 2 = tls advertised and attempted negotiations failed
		# note there's some duplicate logic here (with process_args) but I think
		# it's best to do as thorough a job covering the options in both places
		# so as to minimize chance of options falling through the cracks
		my $result = do_smtp_tls($ehlo);
		if ($result == 1) {
			ptrans(12, "Host did not advertise STARTTLS");
			do_smtp_quit(1, 29) if (!$G::tls_optional);
		} elsif ($result == 2) {
			ptrans(12, "STARTTLS attempted but failed");
			exit(29) if ($G::tls_optional != 1);
		}
	} elsif ($G::tls_optional == 2 && $ehlo->{STARTTLS}) {
		ptrans(12, "TLS requested, advertised, and locally unavailable.  Exiting");
		do_smtp_quit(1, 29);
	}

	# QUIT here if the user has asked us to do so
	do_smtp_quit(1, 0) if ($G::quit_after eq 'tls');

	#if ($G::link{tls}{active} && $ehlo->{STARTTLS}) {
	if ($G::link{tls}{active} && !$G::tls_on_connect) {
		# According to RFC3207, we need to forget state info and re-EHLO here
		$ehlo = {};
		do_smtp_helo($helo, $ehlo, $G::protocol) || do_smtp_quit(1, 32);
	}

	# QUIT here if the user has asked us to do so
	do_smtp_quit(1, 0) if ($G::quit_after eq 'helo');

	# handle auth here if user has requested it
	if ($a_type) {
		# 0 = auth succeeded
		# 1 = auth not advertised
		# 2 = auth advertised but not attempted, no matching auth types
		# 3 = auth advertised but not attempted, auth not supported
		# 4 = auth advertised and attempted but no type succeeded
		# note there's some duplicate logic here (with process_args) but I think
		# it's best to do as thorough a job covering the options in both places
		# so as to minimize chance of options falling through the cracks
		my $result = do_smtp_auth($ehlo, $a_type, $a_user, $a_pass);
		if ($result == 1) {
			ptrans(12, "Host did not advertise authentication");
			do_smtp_quit(1, 28) if (!$G::auth_optional);
		} elsif ($result == 2) {
			if ($G::auth_type eq 'ANY') {
				ptrans(12, "Auth not attempted, no advertised types available");
				do_smtp_quit(1, 28) if ($G::auth_optional != 1);
			} else {
				ptrans(12, "Auth not attempted, requested type not available");
				do_smtp_quit(1, 28) if (!$G::auth_optional);
			}
		} elsif ($result == 3) {
			ptrans(12, "Auth advertised but not supported locally");
			do_smtp_quit(1, 28) if ($G::auth_optional != 1);
		} elsif ($result == 4) {
			ptrans(12, "No authentication type succeeded");
			do_smtp_quit(1, 28) if ($G::auth_optional != 1);
		}
	} elsif ($G::auth_optional == 2 && $ehlo->{AUTH}) {
		ptrans(12, "Auth requested, advertised, and locally unavailable.  Exiting");
		do_smtp_quit(1, 28);
	}

	# QUIT here if the user has asked us to do so
	do_smtp_quit(1, 0) if ($G::quit_after eq 'auth');

	# send MAIL
	do_smtp_mail($from); # failures in this handled by smtp_mail_callback

	# QUIT here if the user has asked us to do so
	do_smtp_quit(1, 0) if ($G::quit_after eq 'mail');

	# send RCPT (sub handles multiple, comma-delimited recips
	do_smtp_rcpt($to); # failures in this handled by smtp_rcpt_callback
	                   # note that smtp_rcpt_callback increments
	                   # $G::smtp_rcpt_failures at every failure.  This and
	                   # $G::smtp_rcpt_total are used after DATA for LMTP

	# QUIT here if the user has asked us to do so
	do_smtp_quit(1, 0) if ($G::quit_after eq 'rcpt');

	# send DATA
	do_smtp_gen('DATA', '354') || do_smtp_quit(1, 25);

	# send the actual data
	do_smtp_data($data, $G::suppress_data) || do_smtp_quit(1, 26);

	# send QUIT
	do_smtp_quit(0) || do_smtp_quit(1, 27);
}

sub tls_post_start {
	ptrans(11, "TLS started with cipher $G::link{tls}{cipher_string}");
	if ($G::link{tls}{local_cert_subject}) {
		ptrans(11, "TLS local DN=\"$G::link{tls}{cert_subject}\"");
	} else {
		ptrans(11, "TLS no local certificate set");
	}
	ptrans(11, "TLS peer DN=\"$G::link{tls}{cert_subject}\"");

	if ($G::tls_get_peer_cert eq 'STDOUT') {
		ptrans(11, $G::link{tls}{cert_x509});
	} elsif ($G::tls_get_peer_cert) {
		open(CERT, ">$G::tls_get_peer_cert") || 
			ptrans(12, "Couldn't open $G::tls_get_peer_cert for writing: $!");
		print CERT $G::link{tls}{cert_x509}, "\n";
		close(CERT);
	}
}

sub start_tls {
	my %t         = (); # This is a convenience var to access $G::link{tls}{...}
	$G::link{tls} = \%t;
	
	Net::SSLeay::load_error_strings();
	Net::SSLeay::SSLeay_add_ssl_algorithms();
	Net::SSLeay::randomize();
	if (!($t{con} = Net::SSLeay::CTX_new())) {
		$t{res} = "CTX_new(): " . Net::SSLeay::ERR_error_string(Net::SSLeay::ERR_get_error());
		return(0);
	}
	
	my $ctx_options = &Net::SSLeay::OP_ALL;
	if (scalar(@G::tls_protocols)) {
		if ($G::tls_protocols[0] =~ /^no_/i) {
			foreach my $p (@G::tls_supported_protocols) {
				if (grep /^no_$p$/i, @G::tls_protocols) {
					no strict "refs";
					$ctx_options |= &{"Net::SSLeay::OP_NO_$p"}();
				}
			}
		} else {
			foreach my $p (@G::tls_supported_protocols) {
				if (!grep /^$p$/i, @G::tls_protocols) {
					no strict "refs";
					$ctx_options |= &{"Net::SSLeay::OP_NO_$p"}();
				}
			}
		}
	}
	Net::SSLeay::CTX_set_options($t{con}, $ctx_options);
	Net::SSLeay::CTX_set_verify($t{con}, 0x01, 0) if ($G::tls_verify);
	
	if ($G::tls_ca_path) {
		my @args = ('', $G::tls_ca_path);
		@args    = ($G::tls_ca_path, '') if (-f $G::tls_ca_path);
		if (!Net::SSLeay::CTX_load_verify_locations($t{con}, @args)) {
			$t{res} = "Unable to set set CA path to (" . join(',', @args) . "): "
			        . Net::SSLeay::ERR_error_string(Net::SSLeay::ERR_get_error());
			return(0);
		}
	} else {
		Net::SSLeay::CTX_set_default_verify_paths($t{con});
	}
	
	if ($G::tls_cipher) {
		if (!Net::SSLeay::CTX_set_cipher_list($t{con}, $G::tls_cipher)) {
			$t{res} = "Unable to set cipher list to $G::tls_cipher: "
			        . Net::SSLeay::ERR_error_string(Net::SSLeay::ERR_get_error());
			return(0);
		}
	}
	if ($G::tls_cert && $G::tls_key) {
		if (!Net::SSLeay::CTX_use_certificate_file($t{con}, $G::tls_cert, &Net::SSLeay::FILETYPE_PEM)) {
			$t{res} = "Unable to add cert file $G::tls_cert to SSL CTX: "
			        . Net::SSLeay::ERR_error_string(Net::SSLeay::ERR_get_error());
			return(0);
		}
		if (!Net::SSLeay::CTX_use_PrivateKey_file($t{con}, $G::tls_key, &Net::SSLeay::FILETYPE_PEM)) {
			$t{res} = "Unable to add key file $G::tls_key to SSL CTX: "
			        . Net::SSLeay::ERR_error_string(Net::SSLeay::ERR_get_error());
			return(0);
		}
	}
	
	if (!($t{ssl} = Net::SSLeay::new($t{con}))) {
		$t{res} = "new(): " . Net::SSLeay::ERR_error_string(Net::SSLeay::ERR_get_error());
		return(0);
	}

	if ($G::link{type} eq 'pipe') {
		Net::SSLeay::set_wfd($t{ssl}, fileno($G::link{sock}{wr})); # error check?
		Net::SSLeay::set_rfd($t{ssl}, fileno($G::link{sock}{re})); # error check?
	} else {
		Net::SSLeay::set_fd($t{ssl}, fileno($G::link{sock})); # error check?
	}

	$t{active} = Net::SSLeay::connect($t{ssl}) == 1 ? 1 : 0;
	if (!$t{active}) {
		$t{res} = "connect(): " . Net::SSLeay::ERR_error_string(Net::SSLeay::ERR_get_error());
		return(0);
	}

	$t{version} = Net::SSLeay::version($t{ssl});
	if ($t{version} == 0x0002) {
		$t{version} = "SSLv2";
	} elsif ($t{version} == 0x0300) {
		$t{version} = "SSLv3";
	} elsif ($t{version} == 0x0301) {
		$t{version} = "TLSv1";
	} elsif ($t{version} == 0x0302) {
		$t{version} = "TLSv1.1"; # openssl/tls1.h
	} elsif ($t{version} == 0x0303) {
		$t{version} = "TLSv1.2"; # openssl/tls1.h
	} elsif ($t{version} == 0xFEFF) {
		$t{version} = "DTLSv1";
	} else {
		$t{version} = sprintf("UNKNOWN(0x%04X)", $t{version});
	}
	$t{cipher}          = Net::SSLeay::get_cipher($t{ssl});
	if (!$t{cipher}) {
		$t{res} = "empty response from get_cipher()";
		return(0);
	}
	$t{cipher_bits}     = Net::SSLeay::get_cipher_bits($t{ssl}, undef);
	if (!$t{cipher_bits}) {
		$t{res} = "empty response from get_cipher_bits()";
		return(0);
	}
	$t{cipher_string}   = sprintf("%s:%s:%s", $t{version}, $t{cipher}, $t{cipher_bits});
	$t{cert}            = Net::SSLeay::get_peer_certificate($t{ssl});
	if (!$t{cert}) {
		$t{res} = "error response from get_peer_certificate()";
		return(0);
	}
	chomp($t{cert_x509} = Net::SSLeay::PEM_get_string_X509($t{cert}));
	$t{cert_subject}    = Net::SSLeay::X509_NAME_oneline(Net::SSLeay::X509_get_subject_name($t{cert}));
	
	if ($G::tls_cert && $G::tls_key) {
		$t{local_cert}            = Net::SSLeay::get_certificate($t{ssl});
		chomp($t{local_cert_x509} = Net::SSLeay::PEM_get_string_X509($t{local_cert}));
		$t{local_cert_subject}    = Net::SSLeay::X509_NAME_oneline(Net::SSLeay::X509_get_subject_name($t{local_cert}));
	}
	
	return($t{active});
}

sub ptrans {
	my $c = shift;  # transaction flag
	my $m = shift;  # message to print
	my $b = shift;  # be brief in what we print
	my $o = $G::trans_fh_oh || \*STDOUT;
	my $f = '';

	return if (($G::hide_send          && int($c/10) == 2)  ||
	           ($G::hide_receive       && int($c/10) == 3)  ||
	           ($G::hide_informational && $c         == 11) ||
	           ($G::hide_all));

	# global option silent controls what we echo to the terminal
	# 0 - print everything
	# 1 - don't show anything until you hit an error, then show everything
	#     received after that (done by setting option to 0 on first error)
	# 2 - don't show anything but errors
	# >=3 - don't print anything
	if ($G::silent > 0) {
		return if ($G::silent >= 3);
		return if ($G::silent == 2 && $c%2 != 0);
		if ($G::silent == 1 && !$G::ptrans_seen_error) {
			if ($c%2 != 0) {
				return();
			} else {
				$G::ptrans_seen_error = 1;
			}
		}
	}
	
	# 1x is program messages
	# 2x is smtp send
	# 3x is smtp recv
	# x = 1 is info/normal
	# x = 2 is error
	# x = 3 dump output
	# program info
	if    ($c == 11) { $f = $G::no_hints_info ? '' : '==='; }
	# program error
	elsif ($c == 12) { $f = $G::no_hints_info ? '' : '***'; $o = $G::trans_fh_eh || \*STDERR; }
	# smtp send info
	elsif ($c == 21) { $f = $G::no_hints_send ? '' : ($G::link{tls}{active} ? ' ~>' : ' ->'); }
	# smtp send error
	elsif ($c == 22) { $f = $G::no_hints_send ? '' : ($G::link{tls}{active} ? '*~>' : '**>'); }
	# smtp send dump output
	elsif ($c == 23) { $f = $G::no_hints_send ? '' : '  >'; }
	# smtp recv info
	elsif ($c == 31) { $f = $G::no_hints_recv ? '' : ($G::link{tls}{active} ? '<~ ' : '<- '); }
	# smtp recv error
	elsif ($c == 32) { $f = $G::no_hints_recv ? '' : ($G::link{tls}{active} ? '<~*' : '<**'); }
	# smtp recv dump output
	elsif ($c == 33) { $f = $G::no_hints_recv ? '' : '<  '; }
	# something went unexpectedly
	else             { $f = '???'; }

	$f .= ' ' if ($f);

	if ($b) {
		# split to tmp list to prevent -w gripe
		my @t = split(/\n/ms, $m); $m = scalar(@t) . " lines sent";
	}
	$m =~ s/\n/\n$f/msg;
	print $o "$f$m\n";
}

sub do_smtp_quit {
	my $exit = shift;
	my $err  = shift;
	
	# Ugh.  Because PIPELINING allows mail's and rcpt's send to be disconnected,
	# and possibly with a QUIT between them, we need to set a global "we have
	# told the server we quit already" flag to prevent double-quits
	return(1) if ($G::link{quit_sent});
	$G::link{quit_sent} = 1;

	$G::link{allow_lost_cxn} = 1;
	my $r = do_smtp_gen('QUIT', '221');
	$G::link{allow_lost_cxn} = 0;

	handle_disconnect($err) if ($G::link{lost_cxn});

	if ($exit) {
		teardown_link();
		exit $err;
	}

	return($r);
}

sub do_smtp_tls {
	my $e  = shift; # ehlo config hash

	# 0 = tls succeeded
	# 1 = tls not advertised
	# 2 = tls advertised and attempted negotiations failed
	if (!$e->{STARTTLS}) {
		return(1);
	} elsif (!do_smtp_gen("STARTTLS", '220')) {
		return(2);
	} elsif (!start_tls()) {
		ptrans(12, "TLS startup failed ($G::link{tls}{res})");
		return(2);
	}
	tls_post_start();

	return(0);
}

sub do_smtp_xclient {
	my $e = shift;
	
	# 0 - xclient succeeded normally
	# 1 - xclient not advertised
	# 2 - xclient advertised but not attempted, mismatch in requested attrs
	# 3 - xclient attempted but did not succeed
	if (!$e->{XCLIENT}) {
		return(1);
	}
	my @parts = ();
	foreach my $attr (keys %{$G::xclient{attr}}) {
		if (!$e->{XCLIENT}{$attr}) {
			return(2);
		}
		# see xtext encoding in http://tools.ietf.org/html/rfc1891
		push(@parts, "$attr=" . join('', map { ($_ == 0x2b || $_ == 0x3D || $_ <= 20 || $_ >= 127)
		                                        ? sprintf("+%02X", $_)
		                                        : chr($_)
		                                     } (unpack("C*", $G::xclient{attr}{$attr}))));
	}
	push(@parts, $G::xclient{raw}) if ($G::xclient{raw});
	my $str = "XCLIENT " . join(' ', @parts);
	do_smtp_gen($str, '220') || return(3);
	return(0);
}

sub do_smtp_auth {
	my $e  = shift; # ehlo config hash
	my $at = shift; # auth type
	my $au = shift; # auth user
	my $ap = shift; # auth password

	return(1) if (!$e->{AUTH});
	return(3) if ($G::auth_unavailable);

	my $auth_attempted = 0; # set to true if we ever attempt auth

	foreach my $btype (@$at) {
		# if server doesn't support, skip type (may change in future)
		next if (!$e->{AUTH}{$btype});

		foreach my $type (@{$G::auth_map_t{'CRAM-MD5'}}) {
			if ($btype eq $type) {
				return(0) if (do_smtp_auth_cram($au, $ap, $type));
				$auth_attempted = 1;
			}
		}
		foreach my $type (@{$G::auth_map_t{'CRAM-SHA1'}}) {
			if ($btype eq $type) {
				return(0) if (do_smtp_auth_cram($au, $ap, $type));
				$auth_attempted = 1;
			}
		}
		foreach my $type (@{$G::auth_map_t{'DIGEST-MD5'}}) {
			if ($btype eq $type) {
				return(0) if (do_smtp_auth_digest($au, $ap, $type));
				$auth_attempted = 1;
			}
		}
		foreach my $type (@{$G::auth_map_t{'NTLM'}}) {
			if ($btype eq $type) {
				return(0) if (do_smtp_auth_ntlm($au, $ap, $type));
				$auth_attempted = 1;
			}
		}
		foreach my $type (@{$G::auth_map_t{'PLAIN'}}) {
			if ($btype eq $type) {
				return(0) if (do_smtp_auth_plain($au, $ap, $type));
				$auth_attempted = 1;
			}
		}
		foreach my $type (@{$G::auth_map_t{'LOGIN'}}) {
			if ($btype eq $type) {
				return(0) if (do_smtp_auth_login($au, $ap, $type));
				$auth_attempted = 1;
			}
		}
	}

	return $auth_attempted ? 4 : 2;
}

sub do_smtp_auth_ntlm {
	my $u  = shift; # auth user
	my $p  = shift; # auth password
	my $as = shift; # auth type (since NTLM might be SPA or MSN)
	my $r  = '';    # will store smtp response

	my $auth_string = "AUTH $as";
	do_smtp_gen($auth_string, '334') || return(0);

	my $d = db64(Authen::NTLM::ntlm());

	$auth_string = eb64($d);
	do_smtp_gen($auth_string, '334', \$r, '',
	            $G::auth_showpt ? "$d" : '',
	            $G::auth_showpt ? \&unencode_smtp : '') || return(0);

	$r =~ s/^....//; # maybe something a little better here?
	Authen::NTLM::ntlm_domain($G::auth_extras{DOMAIN});
	Authen::NTLM::ntlm_user($u);
	Authen::NTLM::ntlm_password($p);
	$d = db64(Authen::NTLM::ntlm($r));

	$auth_string = eb64($d);
	do_smtp_gen($auth_string, '235', \$r, '', $G::auth_showpt ? "$d" : '') || return(0);

	return(1);
}

sub do_smtp_auth_digest {
	my $u  = shift; # auth user
	my $p  = shift; # auth password
	my $as = shift; # auth string
	my $r  = '';    # will store smtp response
	my $e  = '';    # will store Authen::SASL errors
	my @digest_uri = ();
	
	if (exists($G::auth_extras{"DMD5-SERV-TYPE"})) {
		$digest_uri[0] = $G::auth_extras{"DMD5-SERV-TYPE"};
	} else {
		$digest_uri[0] = 'smtp';
	}
	if (exists($G::auth_extras{"DMD5-HOST"})) {
		$digest_uri[1] = $G::auth_extras{"DMD5-HOST"};
	} else {
		if ($G::link{type} eq 'socket-unix') {
			$digest_uri[1] = $G::link{sockfile};
			$digest_uri[1] =~ s|[^a-zA-Z0-9\.\-]|-|g;
		} elsif ($G::link{type} eq 'pipe') {
			$digest_uri[1] = $G::link{process};
			$digest_uri[1] =~ s|[^a-zA-Z0-9\.\-]|-|g;
		} else {
			$digest_uri[1] = $G::link{server};
		}
	}
	if (exists($G::auth_extras{"DMD5-SERV-NAME"})) {
		# There seems to be a hole in the Authen::SASL interface where there's
		# no option to directory provide the digest-uri serv-name.  But we can
		# trick it into using the value we want by tacking it onto the end of host
		$digest_uri[1] .= '/' . $G::auth_extras{"DMD5-SERV-NAME"};
	}

	my $auth_string = "AUTH $as";
	do_smtp_gen($auth_string, '334', \$r, '', '', $G::auth_showpt ? \&unencode_smtp : '')
		|| return(0);

	$r =~ s/^....//; # maybe something a little better here?
	$r = db64($r);
	
	my $callbacks = { user => $u, pass => $p };
	if (exists($G::auth_extras{REALM})) {
		$callbacks->{realm} = $G::auth_extras{REALM};
	}
	
	my $sasl = Authen::SASL->new(
		debug     => 1,
		mechanism => 'DIGEST-MD5',
		callback  => $callbacks,
	);
	my $sasl_client = $sasl->client_new(@digest_uri);
	
	# Force the DIGEST-MD5 session to use qop=auth.  I'm open to exposing this setting
	# via some swaks options, but I don't know enough about the protocol to just guess
	# here.  I do know that letting it auto-negotiate didn't work in my reference
	# environment.  sendmail advertised auth,auth-int,auth-conf, but when Authen::SASL
	# chose auth-int the session would fail (server would say auth succeeded, but then
	# immediately terminate my session when I sent MAIL).  My reference client
	# (Mulberry) always sent auth, and indeed forcing swaks to auth also seems to work.
	# If anyone out there knows more about this please let me know.
	$sasl_client->property('maxssf' => 0);

	$auth_string = $sasl_client->client_step($r);
	if ($e = $sasl_client->error()) {
		ptrans('12', "Error received from Authen::SASL sub-system: $e");
		return(0);
	}
	
	do_smtp_gen(eb64($auth_string), '334', \$r, '',
	                 $G::auth_showpt ? "$auth_string" : '',
	                 $G::auth_showpt ? \&unencode_smtp : '')
		|| return(0);
	$r =~ s/^....//; # maybe something a little better here?
	$r = db64($r);

	$auth_string = $sasl_client->client_step($r);
	if ($e = $sasl_client->error()) {
		ptrans('12', "Canceling SASL exchange, error received from Authen::SASL sub-system: $e");
		$auth_string = '*';
	}
	#do_smtp_gen(eb64($auth_string), '235', \$r, '', $G::auth_showpt ? "$auth_string" : '')
	do_smtp_gen($auth_string, '235', \$r, '', $auth_string)
		|| return(0);
	if ($e = $sasl_client->error()) {
		ptrans('12', "Error received from Authen::SASL sub-system: $e");
		return(0);
	}
	return(0) if (!$sasl_client->is_success());

	return(1);
}

# This can handle both CRAM-MD5 and CRAM-SHA1
sub do_smtp_auth_cram {
	my $u  = shift; # auth user
	my $p  = shift; # auth password
	my $as = shift; # auth string
	my $r  = '';    # will store smtp response

	my $auth_string = "AUTH $as";
	do_smtp_gen($auth_string, '334', \$r, '', '', $G::auth_showpt ? \&unencode_smtp : '')
			|| return(0);

	$r =~ s/^....//; # maybe something a little better here?
	# specify which type of digest we need based on $as
	my $d = get_digest($p, $r, ($as =~ /-SHA1$/ ? 'sha1' : 'md5'));
	$auth_string = eb64("$u $d");

	do_smtp_gen($auth_string, '235', undef, '', $G::auth_showpt ? "$u $d" : '') || return(0);
	return(1);
}

sub do_smtp_auth_login {
	my $u  = shift; # auth user
	my $p  = shift; # auth password
	my $as = shift; # auth string

	do_smtp_gen("AUTH $as", '334', undef, '', '', $G::auth_showpt ? \&unencode_smtp : '')
		|| return(0);
	do_smtp_gen(eb64($u),   '334', undef, '', $G::auth_showpt ? $u : '', $G::auth_showpt ? \&unencode_smtp : '')
		|| return(0);
	do_smtp_gen(eb64($p),   '235', undef, '',
	            $G::auth_showpt ? ($G::auth_hidepw || $p) : eb64($G::auth_hidepw || $p))
		|| return(0);
	return(1);
}

sub do_smtp_auth_plain {
	my $u  = shift; # auth user
	my $p  = shift; # auth password
	my $as = shift; # auth string

	return(do_smtp_gen("AUTH $as " . eb64("\0$u\0$p"), '235', undef, '',
	                   $G::auth_showpt ? "AUTH $as \\0$u\\0" . ($G::auth_hidepw || $p)
	                   : "AUTH $as " . eb64("\0$u\0" . ($G::auth_hidepw || $p))));
}

sub do_smtp_helo {
	my $h = shift;  # helo string to use
	my $e = shift;  # this is a hashref that will be populated w/ server options
	my $p = shift;  # protocol for the transaction
	my $r = '';     # this'll be populated by do_smtp_gen

	if ($p eq 'esmtp' || $p eq 'lmtp') {
		my $l = $p eq 'lmtp' ? "LHLO" : "EHLO";
		if (do_smtp_gen("$l $h", '250', \$r)) {
			# There's not a standard structure for the $e hashref, each
			# key is stored in the manner that makes the most sense
			foreach my $l (split(/\n/, $r)) {
				$l =~ s/^....//;
				if ($l =~ /^AUTH=?(.*)$/) {
					map { $e->{AUTH}{uc($_)} = 1 } (split(' ', $1));
				} elsif ($l =~ /^XCLIENT\s+(.*)$/) {
					map { $e->{XCLIENT}{uc($_)} = 1 } (split(' ', $1));
				} elsif ($l =~ /^STARTTLS$/) {
					$e->{STARTTLS} = 1;
				} elsif ($l =~ /^PIPELINING$/) {
					$e->{PIPELINING} = 1;
					$G::pipeline_adv = 1;
				}
			}
			return(1);
		}
	}
	if ($p eq 'esmtp' || $p eq 'smtp') {
		return(do_smtp_gen("HELO $h", '250'));
	}

	return(0);
}

sub do_smtp_mail {
	my $m = shift;  # from address

	transact(cxn_string => "MAIL FROM:<$m>", expect => '250', defer => 1, fail_callback => \&smtp_mail_callback);

	return(1); # the callback handles failures, so just return here
}

# this only really needs to exist until I figure out a clever way of making
# do_smtp_quit the callback while still preserving the exit codes
sub smtp_mail_callback {
	do_smtp_quit(1, 23);
}

sub do_smtp_rcpt {
	my $m = shift;  # string of comma separated recipients
	my $f = 0;      # The number of failures we've experienced
	my @a = split(/,/, $m);
	$G::smtp_rcpt_total = scalar(@a);
	
	foreach my $addr (@a) {
		transact(cxn_string => "RCPT TO:<$addr>", expect => '250', defer => 1,
		         fail_callback => \&smtp_rcpt_callback);
	}

	return(1); # the callback handles failures, so just return here
}

sub smtp_rcpt_callback {
	# record that a failure occurred
	$G::smtp_rcpt_failures++;

	# if the number of failures is the same as the total rcpts (if every rcpt rejected), quit.
	if ($G::smtp_rcpt_failures == $G::smtp_rcpt_total) {
		do_smtp_quit(1, 24);
	}
}

sub do_smtp_data {
	my $m = shift; # string to send
	my $b = shift; # be brief in the data we send

	my $calls = $G::smtp_rcpt_total - $G::smtp_rcpt_failures;
	my $ok    = transact(cxn_string => $m, expect => '250', summarize_output => $b);

	# now be a little messy - lmtp is not a lockstep after data - we need to
	# listen for as many calls as we had accepted recipients
	if ($G::protocol eq 'lmtp') {
		foreach my $c (1..($calls-1)) { # -1 because we already got 1 above
			$ok += transact(cxn_string => undef, expect => '250');
		}
	}
	return($ok)
}

sub do_smtp_gen {
	my $m = shift; # string to send
	my $e = shift; # String we're expecting to get back
	my $p = shift; # this is a scalar ref, assign the server return string to it
	my $b = shift; # be brief in the data we send
	my $x = shift; # if this is populated, print this instead of $m
	my $c = shift; # if this is a code ref, call it on the return value b4 print
	my $r = '';    # This'll be the return value from transact()
	my $time;

	return transact(cxn_string       => $m, expect      => $e, return_text => $p,
	                summarize_output => $b, show_string => $x,
	                print_callback   => $c
	               );
}

# If we detect that the other side has gone away when we were expecting
# to still be reading, come in here to error and die.  Abstracted because
# the error message will vary depending on the type of connection
sub handle_disconnect {
	my $e = shift || 6; # this is the code we will exit with
	if ($G::link{type} eq 'socket-inet') {
		ptrans(12, "Remote host closed connection unexpectedly.");
	} elsif ($G::link{type} eq 'socket-unix') {
		ptrans(12, "Socket closed connection unexpectedly.");
	} elsif ($G::link{type} eq 'pipe') {
		ptrans(12, "Child process closed connection unexpectedly.");
	}
	exit($e);
}

sub flush_send_buffer {
	my $s = $G::link{type} eq 'pipe' ? $G::link{sock}->{wr} : $G::link{sock};
	return if (!$G::send_buffer);
	if ($G::link{tls}{active}) {
		my $res = Net::SSLeay::write($G::link{tls}{ssl}, $G::send_buffer);
	} else {
		print $s $G::send_buffer;
	}
	ptrans(23, hdump($G::send_buffer)) if ($G::show_raw_text);
	$G::send_buffer = '';
}

sub send_data {
	my $d = shift; # data to write
	$G::send_buffer .= "$d\r\n";
}

sub recv_line {
	# Either an IO::Socket obj or a FH to my child - the thing to read from
	my $s = $G::link{type} eq 'pipe' ? $G::link{sock}->{re} : $G::link{sock};
	my $r = undef;
	my $t = undef;
	my $c = 0;
	
	while ($G::recv_buffer !~ m|\n|si) {
		last if (++$c > 1000); # Maybe I'll remove this once I trust this code more
		if ($G::link{tls}{active}) {
			$t = Net::SSLeay::read($G::link{tls}{ssl});
			return($t) if (!defined($t));
			
			# THIS CODE COPIED FROM THE ELSE BELOW.  Found I could trip this condition
			# by having the server sever the connection but not have swaks realize the
			# connection was gone.  For instance, send a PIPELINE mail that includes a 
			# "-q rcpt".  There wass a bug in swaks that made it try to send another quit
			# later, thus tripping this "1000 reads" error (but only in TLS).
			# Short term: add line below to prevent these reads
			# Short Term: fix the "double-quit" bug
			# Longer term: test to see if remote side closed connection
			
			# the above line should be good enough but it isn't returning
			# undef for some reason.  I think heuristically it will be sufficient
			# to just look for an empty packet (I hope.  gulp).  Comment out the
			# following line if your swaks seems to be saying that it lost connection
			# for no good reason.  Then email me about it.
			return(undef()) if (!length($t));
		} elsif ($G::link{type} eq 'pipe') {
			# XXX in a future release see if I can get read() or equiv to work on a pipe
			$t = <$s>;
			return($t) if (!defined($t));
			
			# THIS CODE COPIED FROM THE ELSE BELOW.
			# the above line should be good enough but it isn't returning
			# undef for some reason.  I think heuristically it will be sufficient
			# to just look for an empty packet (I hope.  gulp).  Comment out the
			# following line if your swaks seems to be saying that it lost connection
			# for no good reason.  Then email me about it.
			return(undef()) if (!length($t));
		} else {      
			# if you're having problems with reads, swap the comments on the
			# the following two lines
			my $recv_r = recv($s, $t, 8192, 0);
			#$t = <$s>;
			return($t) if (!defined($t));
			
			# the above line should be good enough but it isn't returning
			# undef for some reason.  I think heuristically it will be sufficient
			# to just look for an empty packet (I hope.  gulp).  Comment out the
			# following line if your swaks seems to be saying that it lost connection
			# for no good reason.  Then email me about it.
			return(undef()) if (!length($t));
			
			#print "\$t = $t (defined = ", defined($t) ? "yes" : "no",
			#      "), \$recv_r = $recv_r (", defined($recv_r) ? "yes" : "no", ")\n";
		}
		$G::recv_buffer .= $t;
		ptrans(33, hdump($t)) if ($G::show_raw_text);
	}
	
	if ($c >= 1000) {
		# If you saw this in the wild, I'd love to hear more about it
		# at proj-swaks@jetmore.net
		ptrans(12, "In recv_line, hit loop counter.  Continuing in unknown state");
	}
	
	# using only bare newlines is bound to cause me problems in the future
	# but it matches the expectation we've already been using.  All we can
	# do is hone in on the proper behavior iteratively.
	if ($G::recv_buffer =~ s|^(.*?\n)||si) {
		$r = $1;
	} else {
		ptrans(12, "I'm in an impossible state");
	}

	$r =~ s|\r||msg;
	return($r);
}

# any request which has immediate set will be checking the return code.
# any non-immediate request will handle results through fail_callback().
# therefore, only return the state of the last transaction attempted,
# which will always be immediate
sub transact {
	my %h        = @_; # this is an smtp transaction element
	my $ret      = 1;  # this is our return value
	my @handlers = (); # will hold any fail_handlers we need to run
	my $time     = ''; # used in time lapse calculations

	push(@G::pending_send, \%h); # push onto send queue
	if (!($G::pipeline && $G::pipeline_adv) || !$h{defer}) {

		if ($G::show_time_lapse) {
			if ($G::show_time_hires) {$time = [Time::HiRes::gettimeofday()];   }
			else                     { $time = time(); }
		}

		while (my $i = shift(@G::pending_send)) {
			if (defined($i->{cxn_string})) {
				ptrans(21, $i->{show_string} || $i->{cxn_string}, $i->{summarize_output});
				send_data($i->{cxn_string});
			}
			push(@G::pending_recv, $i);
		}
		flush_send_buffer();
		while (my $i = shift(@G::pending_recv)) {
			my $buff = '';
			eval {
				local $SIG{'ALRM'} = sub {
					$buff = "Timeout ($G::link{timeout} secs) waiting for server response";
					die;
				};
				alarm($G::link{timeout});
				while ($buff !~ /^\d\d\d /m) {
					my $l = recv_line();
					$buff .= $l;
					if (!defined($l)) {
						$G::link{lost_cxn} = 1;
						last;
					}
				}
				chomp($buff);
				alarm(0);
			};

			if ($G::show_time_lapse) {
				if ($G::show_time_hires) {
					$time = sprintf("%0.03f", Time::HiRes::tv_interval($time, [Time::HiRes::gettimeofday()]));
					ptrans(11, "response in ${time}s");
					$time = [Time::HiRes::gettimeofday()];
				} else {
					$time = time() - $time;
					ptrans(11, "response in ${time}s");
					$time = time();
				}
			}

			${$i->{return_text}} = $buff;
			$buff = &{$i->{print_callback}}($buff) if (ref($i->{print_callback}) eq 'CODE');
			my $ptc;
			($ret,$ptc) = $buff !~ /^$i->{expect} /m ? (0,32) : (1,31);
			ptrans($ptc, $buff) if ($buff);
			if ($G::link{lost_cxn}) {
				if ($G::link{allow_lost_cxn}) {
					# this means the calling code wants to handle a lost cxn itself
					return($ret);
				} else {
					# if caller didn't want to handle, we'll handle a lost cxn ourselves
					handle_disconnect();
				}
			}
			if (!$ret && ref($i->{fail_callback}) eq 'CODE') {
				push(@handlers, $i->{fail_callback});
			}
		}
	}
	foreach my $h (@handlers) { &{$h}(); }
	return($ret);
}

# a quick-and-dirty hex dumper.  Currently used by --show-raw-text
sub hdump {
	my $r = shift;
	my $c = 0;  # counter
	my $i = 16; # increment value
	my $b;      # buffer

	while (length($r) && ($r =~ s|^(.{1,$i})||smi)) {
		my $s = $1; # $s will be the ascii string we manipulate for display
		my @c = map { ord($_); } (split('', $s));
		$s =~ s|[^\x21-\x7E]|.|g;

		my $hfs = ''; # This is the hex format string for printf
		for (my $hc = 0; $hc < $i; $hc++) {
			$hfs .= ' ' if (!($hc%4));
			if ($hc < scalar(@c)) { $hfs .= '%02X '; } else { $hfs .= '   '; }
		}

		$b .= sprintf("%04d:$hfs   %-16s\n", $c, @c, $s);
		$c += $i;
	}
	chomp($b); # inelegant remnant of hdump's previous life
	return($b)
}

sub unencode_smtp {
	my $t = shift;

	my @t = split(' ', $t, 2);
	if ($t[1] =~ /\s/) {
		# very occasionally we can have a situation where a successful response will
		# be b64 encoded, while an error will not be.  Try to tell the difference.
		return($t);	
	} else {
		return("$t[0] " . db64($t[1]));
	}
}

sub interact {
	my $prompt     = shift;
	my $regexp     = shift;
	my $hide_input = shift;
	my $response   = '';

	do {
		print $prompt;
		if (!$hide_input || !$G::protect_prompt || $G::interact_method eq 'default') {
			chomp($response = <STDIN>);
		} else {
			if ($^O eq 'MSWin32') {
				#if ($G::interact_method eq "win32-console" ||
				#   (!$G::interact_method && load("Win32::Console")))
				#{
				#    Couldn't get this working in the time I wanted to devote to it
				#}
				if ($G::interact_method eq "win32-readkey" ||
					 (!$G::interact_method && load("Term::ReadKey")))
				{
					$G::interact_method ||= "win32-readkey";
					# the trick to replace input w/ '*' doesn't work on Win32
					# Term::ReadKey, so just use it as an stty replacement
					ReadMode('noecho');
					# need to think about this on windows some more
					#local $SIG{INT} = sub { ReadMode('restore'); };
					chomp($response = <STDIN>);
					ReadMode('restore');
				} else {
					$G::interact_method ||= "default";
					chomp($response = <STDIN>);
				}
			} else {
				if ($G::interact_method eq "unix-readkey" || (!$G::interact_method && load("Term::ReadKey"))) {
					$G::interact_method ||= "unix-readkey";
					my @resp = ();
					ReadMode('raw');
					#local $SIG{INT} = 
					# reevaluate this code - what happens if del is first char we press?
					while ((my $kp = ReadKey(0)) ne "\n") {
						my $kp_num = ord($kp);
						if($kp_num == 127 || $kp_num == 8) {
							next if (!scalar(@resp));
							pop(@resp);
							print "\b \b";
						} elsif($kp_num >= 32) {
							push(@resp, $kp);
							print "*";
						}
					}
					ReadMode('restore');
					$response = join('', @resp);
				} elsif ($G::interact_method eq "unix-stty" || (!$G::interact_method && open(STTY, "stty -a |"))) {
					$G::interact_method ||= "unix-stty";
					{ my $foo = join('', <STTY>); }
					system('stty', '-echo');
					chomp($response = <STDIN>);
					system('stty', 'echo');
				} else {
					$G::interact_method ||= "default";
					chomp($response = <STDIN>);
				}
			}
		}
	} while ($regexp ne 'SKIP' && $response !~ /$regexp/);

	return($response);
}

sub get_hostname {
	# in some cases hostname returns value but gethostbyname doesn't.
	return("") if (!avail("hostname"));
	
	my $h = hostname();
	return("") if (!$h);
	
	my $l = (gethostbyname($h))[0];
	return($l || $h);
}

sub get_server {
	my $addr   = shift;
	my $pref   = -1;
	my $server = "localhost";

	if ($addr =~ /\@?\[(\d+\.\d+\.\d+\.\d+)\]$/) {
		# handle automatic routing of domain literals (user@[1.2.3.4])
		return($1);
	} elsif ($addr =~ /\@?\#(\d+)$/) {
		# handle automatic routing of decimal domain literals (user@#16909060)
		$addr = $1;
		return(($addr/(2**24))%(2**8) . '.' . ($addr/(2**16))%(2**8) . '.' .
		       ($addr/(2**8))%(2**8)  . '.' . ($addr/(2**0))%(2**8));
	}

	if (!avail("dns")) {
		ptrans(12, avail_str("dns"). ".  Using $server as mail server");
		return($server);
	}
	my $res = Net::DNS::Resolver->new();

	$addr =~ s/^.*\@([^\@]*)$/$1/;
	return($server) if (!$addr);
	$server = $addr;

	my @mx = mx($res, $addr);
	foreach my $rr (sort { $a->preference <=> $b->preference } @mx) {
		if ($G::link{force_ipv4}) {
			if ($res->query($rr->exchange, 'A')) {
				$server = $rr->exchange;
				last;
			}
		} elsif ($G::link{force_ipv6}) {
			if ($res->query($rr->exchange, 'AAAA') || $res->query($rr->exchange, 'A6')) {
				$server = $rr->exchange;
				last;
			}
		} else {
			# this is the old default behavior.  Take the best priority MX, no matter what.
			$server = $rr->exchange;
			last;
		}
	}
	return($server);
}

sub load {
	my $m = shift;

	return $G::modules{$m} if (exists($G::modules{$m}));
	eval("use $m");
	return $G::modules{$m} = $@ ? 0 : 1;
}

# Currently this is just an informational string - it's set on both
# success and failure.  It currently has four output formats (supported,
# supported but not optimal, unsupported, unsupported and missing optimal)
sub avail_str { return $G::dependencies{$_[0]}{errstr}; }

sub avail {
	my $f = shift; # this is the feature we want to check support for (auth, tls)
	my $s = \%G::dependencies;

	# return immediately if we've already tested this.
	return($s->{$f}{avail}) if (exists($s->{$f}{avail}));

	$s->{$f}{req_failed} = [];
	$s->{$f}{opt_failed} = [];
	foreach my $m (@{$s->{$f}{req}}) {
		push(@{$s->{$f}{req_failed}}, $m) if (!load($m));
	}
	foreach my $m (@{$s->{$f}{opt}}) {
		push(@{$s->{$f}{opt_failed}}, $m) if (!load($m));
	}

	if (scalar(@{$s->{$f}{req_failed}})) {
		$s->{$f}{errstr} = "$s->{$f}{name} not available: requires " . join(', ', @{$s->{$f}{req_failed}});
		if (scalar(@{$s->{$f}{opt_failed}})) {
			$s->{$f}{errstr} .= ".  Also missing optimizing " . join(', ', @{$s->{$f}{opt_failed}});
		}
		return $s->{$f}{avail} = 0;
	} else {
		if (scalar(@{$s->{$f}{opt_failed}})) {
			$s->{$f}{errstr} = "$s->{$f}{name} supported, but missing optimizing " . 
			                   join(', ', @{$s->{$f}{opt_failed}});
		} else {
			$s->{$f}{errstr} = "$s->{$f}{name} supported";
		}
		return $s->{$f}{avail} = 1;
	}
}

sub get_digest {
	my $secr = shift;
	my $chal = shift;
	my $type = shift || 'md5';
	my $ipad = chr(0x36) x 64;
	my $opad = chr(0x5c) x 64;

	if ($chal !~ /^</) {
		chomp($chal = db64($chal));
	}

	if (length($secr) > 64) {
		if ($type eq 'md5') {
			$secr = Digest::MD5::md5($secr);
		} elsif ($type eq 'sha1') {
			$secr = Digest::SHA::sha1($secr);
		}
	} else {
		$secr .= chr(0) x (64 - length($secr));
	}

	my $digest = $type eq 'md5' ? Digest::MD5::md5_hex(($secr ^ $opad), Digest::MD5::md5(($secr ^ $ipad), $chal))
	                            : Digest::SHA::sha1_hex(($secr ^ $opad), Digest::SHA::sha1(($secr ^ $ipad), $chal));
	return($digest);
}

sub test_support {
	my $s = \%G::dependencies;

	foreach my $act (sort { $s->{$a}{name} cmp $s->{$b}{name} } keys %$s) {
		ptrans(avail($act) ? 11 : 12, avail_str($act));
	}
}

sub time_to_seconds {
	my $t = shift || 30;

	if ($t !~ /^(\d+)([hms])?/i) {
		return(30); # error condition - just use default value
	} else {
		my $r = $1;
		my $u = lc($2);
		if ($u eq 'h') {
			return($r * 3600);
		} elsif ($u eq 'm') {
			return($r * 60);
		} else {
			return($r);
		}
	}
}

sub load_dependencies {
	%G::dependencies = (
		auth            => { name => "Basic AUTH",               opt => ['MIME::Base64'],
		                                                         req => []                    },
		auth_cram_md5   => { name => "AUTH CRAM-MD5",            req => ['Digest::MD5']       },
		auth_cram_sha1  => { name => "AUTH CRAM-SHA1",           req => ['Digest::SHA']      },
		auth_ntlm       => { name => "AUTH NTLM",                req => ['Authen::NTLM']      },
		auth_digest_md5 => { name => "AUTH DIGEST-MD5",          req => ['Authen::SASL']      },
		dns             => { name => "MX Routing",               req => ['Net::DNS']          },
		tls             => { name => "TLS",                      req => ['Net::SSLeay']       },
		pipe            => { name => "Pipe Transport",           req => ['IPC::Open2']        },
		socket          => { name => "Socket Transport",         req => ['IO::Socket']        },
		ipv6            => { name => "IPv6",                     req => ['IO::Socket::INET6'] },
		date_manip      => { name => "Date Manipulation",        req => ['Time::Local']       },
		hostname        => { name => "Local Hostname Detection", req => ['Sys::Hostname']     },
		hires_timing    => { name => "High Resolution Timing",   req => ['Time::HiRes']       },
	);
}

sub get_option_struct {
	@G::raw_option_data = (
		# location of config file
		{ opts => ['config'],                         suffix => ':s',
		  okey => 'config_file',                      type => 'scalar', },
		# envelope-(f)rom address
		{ opts => ['f', 'from'],                      suffix => ':s',
		  okey => 'mail_from',                        type => 'scalar', },
		# envelope-(t)o address
		{ opts => ['t', 'to'],                        suffix => ':s',
		  okey => 'mail_to',                          type => 'scalar', },
		# (h)elo string
		{ opts => ['h', 'helo', 'ehlo', 'lhlo'],      suffix => ':s',
		  okey => 'mail_helo',                        type => 'scalar', },
		# (s)erver to use
		{ opts => ['s', 'server'],                    suffix => ':s',
		  okey => 'mail_server',                      type => 'scalar', },
		# force ipv4 only
		{ opts => ['4'],                              suffix => '',
		  okey => 'force_ipv4',                       type => 'scalar', },
		# force ipv6 only
		{ opts => ['6'],                              suffix => '',
		  okey => 'force_ipv6',                       type => 'scalar', },
		# copy MX/routing from another domain
		{ opts => ['copy-routing'],                   suffix => ':s',
		  okey => 'copy_routing',                     type => 'scalar', },
		# (p)ort to use
		{ opts => ['p', 'port'],                      suffix => ':s',
		  okey => 'mail_port',                        type => 'scalar', },
		# protocol to use (smtp, esmtp, lmtp)
		{ opts => ['protocol'],                       suffix => ':s',
		  okey => 'mail_protocol',                    type => 'scalar', },
		# (d)ata portion ('\n' for newlines)
		{ opts => ['d', 'data'],                      suffix => ':s',
		  okey => 'mail_data',                        type => 'scalar', },
		# use the --dump text as default body
		{ opts => ['dab', 'dump-as-body'],            suffix => '',
		  okey => 'dump_as_body',                     type => 'scalar', },
		# implies --dump-as-body; forces raw passwords to be used
		{ opts => ['dabsp', 'dump-as-body-shows-password'], suffix => '',
		  okey => 'dab_sp',                           type => 'scalar', },
		# timeout for each trans (def 30s)
		{ opts => ['timeout'],                        suffix => ':s',
		  okey => 'timeout',                          type => 'scalar', },
		# (g)et data on stdin
		{ opts => ['g'],                              suffix => '',
		  okey => 'data_on_stdin',                    type => 'scalar', },
		# (q)uit after
		{ opts => ['q', 'quit', 'quit-after'],        suffix => '=s',
		  okey => 'quit_after',                       type => 'scalar', },
		# do (n)ot print data portion
		{ opts => ['n', 'suppress-data'],             suffix => '',
		  okey => 'suppress_data',                    type => 'scalar', },
		# force auth, exit if not supported
		{ opts => ['a', 'auth'],                      suffix => ':s',
		  okey => 'auth',                             type => 'scalar', },
		# user for auth
		{ opts => ['au', 'auth-user'],                suffix => ':s',
		  okey => 'auth_user',                        type => 'scalar', },
		# pass for auth
		{ opts => ['ap', 'auth-password'],            suffix => ':s',
		  okey => 'auth_pass',                        type => 'scalar', },
		# auth type map
		{ opts => ['am', 'auth-map'],                 suffix => '=s',
		  okey => 'auth_map',                         type => 'scalar', },
		# extra, authenticator-specific options
		{ opts => ['ae', 'auth-extra'],               suffix => '=s',
		  okey => 'auth_extra',                       type => 'scalar', },
		# hide passwords when possible
		{ opts => ['ahp', 'auth-hide-password'],      suffix => ':s',
		  okey => 'auth_hidepw',                      type => 'scalar', },
		# translate base64 strings
		{ opts => ['apt', 'auth-plaintext'],          suffix => '',
		  okey => 'auth_showpt',                      type => 'scalar', },
		# auth optional (ignore failure)
		{ opts => ['ao', 'auth-optional'],            suffix => ':s',
		  okey => 'auth_optional',                    type => 'scalar', },
		# req auth if avail
		{ opts => ['aos', 'auth-optional-strict'],    suffix => ':s',
		  okey => 'auth_optional_strict',             type => 'scalar', },
		# report capabilties
		{ opts => ['support'],                        suffix => '',
		  okey => 'get_support',                      type => 'scalar', },
		# local interface to use
		{ opts => ['li', 'local-interface'],          suffix => ':s',
		  okey => 'lint',                             type => 'scalar', },
		# local port
		{ opts => ['lp', 'lport'],                    suffix => ':s',
		  okey => 'lport',                            type => 'scalar', },
		# use TLS
		{ opts => ['tls'],                            suffix => '',
		  okey => 'tls',                              type => 'scalar', },
		# use tls if available
		{ opts => ['tlso', 'tls-optional'],           suffix => '',
		  okey => 'tls_optional',                     type => 'scalar', },
		# req tls if avail
		{ opts => ['tlsos', 'tls-optional-strict'],   suffix => ':s',
		  okey => 'tls_optional_strict',              type => 'scalar', },
		# use tls if available
		{ opts => ['tlsc', 'tls-on-connect'],         suffix => '',
		  okey => 'tls_on_connect',                   type => 'scalar', },
		# local cert to present to server
		{ opts => ['tls-cert'],                       suffix => '=s',
		  okey => 'tls_cert',                         type => 'scalar', },
		# local key to present to server
		{ opts => ['tls-key'],                        suffix => '=s',
		  okey => 'tls_key',                          type => 'scalar', },
		# local key to present to server
		{ opts => ['tlsp', 'tls-protocol'],           suffix => '=s',
		  okey => 'tls_protocol',                     type => 'scalar', },
		# local key to present to server
		{ opts => ['tls-cipher'],                     suffix => '=s',
		  okey => 'tls_cipher',                       type => 'scalar', },
		# save tls peer certificate
		{ opts => ['tls-get-peer-cert'],              suffix => ':s',
		  okey => 'tls_get_peer_cert',                type => 'scalar', },
		# require verification of server certificate
		{ opts => ['tls-verify'],                     suffix => '',
		  okey => 'tls_verify',                       type => 'scalar', },
		# local key to present to server
		{ opts => ['tls-ca-path'],                    suffix => '=s',
		  okey => 'tls_ca_path',                      type => 'scalar', },
		# suppress output to varying degrees
		{ opts => ['S', 'silent'],                    suffix => ':i',
		  okey => 'silent',                           type => 'sub',
		  literal => 'sub { $r->{silent} = $_[1] || 1; }',              },
		# Don't strip From_ line from DATA
		{ opts => ['nsf', 'no-strip-from'],           suffix => '',
		  okey => 'no_strip_from',                    type => 'scalar', },
		# Use the old, one-character substitution tokens (%H, %D, etc)
		{ opts => ['use-old-data-tokens'],            suffix => '',
		  okey => 'use_old_data_tokens',              type => 'scalar', },
		# Don't show send/receive hints (legacy)
		{ opts => ['nth', 'no-hints'],                suffix => '',
		  okey => 'no_hints',                         type => 'scalar', },
		# Don't show transaction hints
		{ opts => ['nsh', 'no-send-hints'],           suffix => '',
		  okey => 'no_hints_send',                    type => 'scalar', },
		# Don't show transaction hints
		{ opts => ['nrh', 'no-receive-hints'],        suffix => '',
		  okey => 'no_hints_recv',                    type => 'scalar', },
		# Don't show transaction hints
		{ opts => ['nih', 'no-info-hints'],           suffix => '',
		  okey => 'no_hints_info',                    type => 'scalar', },
		# Don't show reception lines
		{ opts => ['hr', 'hide-receive'],             suffix => '',
		  okey => 'hide_receive',                     type => 'scalar', },
		# Don't show sending lines
		{ opts => ['hs', 'hide-send'],                suffix => '',
		  okey => 'hide_send',                        type => 'scalar', },
		# Don't echo input on potentially sensitive prompts
		{ opts => ['pp', 'protect-prompt'],           suffix => '',
		  okey => 'protect_prompt',                   type => 'scalar', },
		# Don't show any swaks-generated, non-error informational lines
		{ opts => ['hi', 'hide-informational'],       suffix => '',
		  okey => 'hide_informational',               type => 'scalar', },
		# Don't send any output to the terminal
		{ opts => ['ha', 'hide-all'],                 suffix => '',
		  okey => 'hide_all',                         type => 'scalar', },
		# print lapse for send/recv
		{ opts => ['stl', 'show-time-lapse'],         suffix => ':s',
		  okey => 'show_time_lapse',                  type => 'scalar', },
		# don't touch the data
		{ opts => ['ndf', 'no-data-fixup'],           suffix => '',
		  okey => 'no_data_fixup',                    type => 'scalar', },
		# show dumps of the raw read/written text
		{ opts => ['raw', 'show-raw-text'],           suffix => '',
		  okey => 'show_raw_text',                    type => 'scalar', },
		# specify file to write to
		{ opts => ['output-file'],                    suffix => '=s',
		  okey => 'output_file',                      type => 'scalar', },
		# specify file to write to
		{ opts => ['output-file-stdout'],             suffix => '=s',
		  okey => 'output_file_stdout',               type => 'scalar', },
		# specify file to write to
		{ opts => ['output-file-stderr'],             suffix => '=s',
		  okey => 'output_file_stderr',               type => 'scalar', },
		# command to communicate with
		{ opts => ['pipe'],                           suffix => ':s',
		  okey => 'pipe_cmd',                         type => 'scalar', },
		# unix domain socket to talk to
		{ opts => ['socket'],                         suffix => ':s',
		  okey => 'socket',                           type => 'scalar', },
		# the content of the body of the DATA
		{ opts => ['body'],                           suffix => ':s',
		  okey => 'body_822',                         type => 'scalar', },
		# A file to attach
		{ opts => ['attach-name','attach-type','attach'], suffix => ':s',
		  okey => 'attach_822',                           type => 'list', },
		# replacement for %NEW_HEADERS% DATA token
		{ opts => ['ah', 'add-header'],               suffix => ':s',
		  okey => 'add_header',                       type => 'list', },
		# replace header if exist, else add
		{ opts => ['header'],                         suffix => ':s',
		  okey => 'header',                           type => 'list', },
		# build options and dump
		{ opts => ['dump'],                           suffix => '',
		  okey => 'dump_args',                        type => 'scalar', },
		# attempt PIPELINING
		{ opts => ['pipeline'],                       suffix => '',
		  okey => 'pipeline',                         type => 'scalar', },
		# use getpwuid building -f
		{ opts => ['force-getpwuid'],                 suffix => '',
		  okey => 'force_getpwuid',                   type => 'scalar', },
		# argument is a raw XCLIENT string
		{ opts => ['xclient'],                        suffix => ':s',
		  okey => 'xclient_raw',                      type => 'scalar', },
		# if set, XCLIENT will proceed even if XCLIENT not advertised
		{ opts => ['xclient-optional'],               suffix => '',
		  okey => 'xclient_optional',                 type => 'scalar', },
		# proceed if xclient not offered, but fail if offered and not accepted
		{ opts => ['xclient-optional-strict'],        suffix => '',
		  okey => 'xclient_optional_strict',          type => 'scalar', },
		## xclient send by default after first helo, but can be sent almost anywhere (cf quit-after)
		#{ opts => ['xclient-after'],                  suffix => ':s',
		#  okey => 'xclient_after',                    type => 'scalar', },
		# XCLIENT NAME
		{ opts => ['xclient-name'],                   suffix => ':s',
		  okey => 'xclient_name',                     type => 'scalar', },
		# XCLIENT ADDR
		{ opts => ['xclient-addr'],                   suffix => ':s',
		  okey => 'xclient_addr',                     type => 'scalar', },
		# XCLIENT PORT
		{ opts => ['xclient-port'],                   suffix => ':s',
		  okey => 'xclient_port',                     type => 'scalar', },
		# XCLIENT PROTO
		{ opts => ['xclient-proto'],                  suffix => ':s',
		  okey => 'xclient_proto',                    type => 'scalar', },
		# XCLIENT HELO
		{ opts => ['xclient-helo'],                   suffix => ':s',
		  okey => 'xclient_helo',                     type => 'scalar', },
		# XCLIENT LOGIN
		{ opts => ['xclient-login'],                  suffix => ':s',
		  okey => 'xclient_login',                    type => 'scalar', },
		# XCLIENT REVERSE_NAME
		{ opts => ['xclient-reverse-name'],           suffix => ':s',
		  okey => 'xclient_reverse_name',             type => 'scalar', },
	);

	return(\@G::raw_option_data);
}

# returns %O, the large raw option hash
sub load_args {
	# this sub is a jumping point.  What we will do is repeatedly massage
	# @ARGV and call GetOptions multiple times.  We are essentially "layering"
	# options.  First we load from a config file (if exists/specified), then
	# from any environment variables, then the actual command line.
	
	# First, save a copy of the real @ARGV, because that's actually what 
	# gets processed last
	my @real_ARGV = @ARGV;
	my %ARGS      = ();
	@ARGV         = ();

	# we load our options processing hash here.  We abstract it back from the
	# native getopt-format because we need to be able to intercept "no-" options
	my $option_list = get_option_struct();
	
	# we want to process config files first.  There's a default config file in
	# ~/.swaksrc, but it is possible for the user to override this with the
	# --config options.  So, find the one and only file we will use here.
	# If we encounter --config in later processing it is a noop.  
	# first find the default file
	my $config_file       = '';
	my $config_is_default = 1;
	foreach my $v (qw(SWAKS_HOME HOME LOGDIR)) {
		if ($ENV{$v}) { $config_file = "$ENV{$v}/.swaksrc"; last; }
	}
	# then look through the ENV args to see if another file set there
	if (exists($ENV{SWAKS_OPT_config})) {
		if (!$ENV{SWAKS_OPT_config}) {
			# if exist but not set, it just means "don't use default file"
			$config_file = "";
		} else {
			$config_file = $ENV{SWAKS_OPT_config};
			$config_is_default = 0;
		}
	}
	# lastly go through original command line looking for config file
	for (my $i = 0; $i < scalar(@real_ARGV); $i++) {
		if ($real_ARGV[$i] =~ /^-?-config$/) {
			if ($real_ARGV[$i+1] =~ /^-/) {
				$config_file = "";
			} else {
				$config_file       = $real_ARGV[$i+1];
				$config_is_default = 0;
			}
		}
	}

	# All of the above will result in $config_file either being empty or
	# containing the one and only config file we will use.
	if ($config_file) {
		foreach my $configf ('&DATA', $config_file) {
			if (open(C, "<$configf")) {
				# "#" in col 0 is a comment
				while (defined(my $m = <C>)) {
					next if ($m =~ m|^#|);
					chomp($m);
					$m = '-' . $m if ($m !~ /^-/);
					push(@ARGV, split(/\s/, $m, 2));
				}
				close(C);
			} elsif (!$config_is_default && $configf eq $config_file) {
				# we only print an error if the config was specified explicitly
				ptrans(12, "Config file $configf could not be opened ($!).  Exiting");
				exit(1);
			}

			# OK, all that work to load @ARGV with values from the config file.  Now
			# we just need to process it.  (don't call if nothing set in @ARGV)
			fetch_args(\%ARGS, $option_list) if (scalar(@ARGV));
		}
	}

	# OK, %ARGS contains all the settings from the config file.  No do it again
	# with SWAKS_OPT_* environment variables
	@ARGV = ();
	foreach my $v (keys %ENV) {
		if ($v =~ m|^SWAKS_OPT_(.*)$|) {
			my $tv = $1; $tv =~ s|_|-|g;
			push(@ARGV, "-$tv", $ENV{$v});
		}
	}
	fetch_args(\%ARGS, $option_list) if (scalar(@ARGV));
	
	# and now, after all of that, process the actual cmdline args
	@ARGV = @real_ARGV;
	fetch_args(\%ARGS, $option_list) if (scalar(@ARGV));

	return(\%ARGS);
}

sub fetch_args {
	my $r = shift;
	my $l = shift;
	
	my %to_delete = ();

	# need to rewrite header-HEADER opts before std option parsing
	# also see if there are any --no- options that need to be processed
	RUNOPTS:
	for (my $i = 0; $i < scalar(@ARGV); $i++) {
		if ($ARGV[$i] =~ /^-?-(.*)$/) {
			my $opt_name = $1;
			foreach my $e (@$l) {
				if (grep /^$opt_name$/, @{$e->{opts}}) {
					delete($to_delete{$e->{okey}});
				}
			}
		}
		if ($ARGV[$i] =~ /^-?-h(?:eader)?-([^:]+):?$/) {
			$ARGV[$i] = "--header"; $ARGV[$i+1] = "$1: $ARGV[$i+1]";
		} elsif ($ARGV[$i] =~ /^-?-(no-(.*))$/) {
			my $whole_name = $1; my $opt_name = $2;
			# loop through each of the options and see if it matches
			foreach my $e (@$l) {
				if (grep /^$whole_name$/, @{$e->{opts}}) {
					next RUNOPTS; # this is a validopt that begins with "no-", skip
				} elsif (grep /^$opt_name$/, @{$e->{opts}}) {
					splice(@ARGV, $i, 1);
					delete($r->{$e->{okey}});
					$to_delete{$e->{okey}} = 1;          
					redo RUNOPTS; # since we're messing with the list, redo this element
				}
			}
			ptrans(12, "Unknown option $ARGV[$i], Exiting");
			exit(1);
		} elsif ($ARGV[$i] =~ /^-?-attach-name$/) {
			if ($ARGV[$i+1] =~ /^-/) {
				# in this case, the user is trying to tell us not to use
				# a filename for the next attachment.  This means we actually have to
				# insert an argument, flagged as a filename, with no value
				# XXX WCSFIXME
				splice(@ARGV, $i+1, 0, "FILENAME:");
			} else {
				# We were given a filename - mark it as such so we can figure
				# it out later
				$ARGV[$i+1] = "FILENAME:" . $ARGV[$i+1];
			}
		}
	}

	# build the actual hash we will pass to GetOptions from our config list ($l):
	# In the end I decided to build this at each call of this sub to that $r
	# is defined.  It's not much of a performance issue.
	my %options = ();
	foreach my $e (@$l) {
		my $k = join('|', @{$e->{opts}}) . $e->{suffix};
		if ($e->{type} eq 'scalar') {
			$options{$k} = \$r->{$e->{okey}};
		} elsif ($e->{type} eq 'list') {
			$options{$k} = \@{$r->{$e->{okey}}};
		} elsif ($e->{type} eq 'sub') {
			eval("\$options{\$k} = $e->{literal};");
		}
	}

	if (!load("Getopt::Long")) {
		ptrans(12, "Unable to load Getopt::Long for option processing, Exiting");
		exit(1);
	}

	Getopt::Long::Configure("bundling_override");
	GetOptions(%options) || exit(1);
	
	# now remove any options that might have been added by a --no option
	# (we have to do this here since it's legal to mix multiple OPT and --no-OPT
	# in the same context (config file, command line, env var)
	if (scalar keys %to_delete) {
		foreach my $e (@$l) {
			foreach my $opt_name (@{$e->{opts}}) {
				if ($to_delete{$opt_name}) {
					delete($r->{$e->{okey}});
				}
			}
		}
	}
}

# take a string and quote it such that it could be used in the shell
# O'Reilley -> 'O'\''Reilley'
sub shquote { my $s = shift; $s =~ s%'%'\\''%g; return "'$s'"; }

sub reconstruct_options {
	my $o = shift; # ref to raw option hash (as returned by load_args)
	my @c = ();    # array to hold our reconstructed command line
	
	foreach my $opt (@G::raw_option_data) {
		if (exists($o->{$opt->{okey}}) && defined($o->{$opt->{okey}})) {
			# Ideally we could rely on the first opt name in the list being the "primary" option,
			# but we can't right now and I don't want to alter the option list.  For now just grab
			# the longest option available as the primary
			my $lopt = (sort { length($b) <=> length($a) } (@{$opt->{opts}}))[0];
			
			if ($opt->{type} eq 'list') {
				next if (ref($o->{$opt->{okey}}) ne 'ARRAY');
				#next if (scalar(@{$o->{$opt->{okey}}}) == 0);
				foreach my $sopt (@{$o->{$opt->{okey}}}) {
					push(@c, "--$lopt", shquote($sopt));
				}
			} else {
				push(@c, "--$lopt");
				if (length($o->{$opt->{okey}}) > 0) {
					# offer rudimenary protection against sending pw in email
					if ($opt->{okey} eq 'auth_pass') {
						push(@c, shquote('PROVIDED_BUT_REMOVED'));
					} else {
						push(@c, shquote($o->{$opt->{okey}}));
					}
				}
			}
		}
	}
	#print join(', ', @c), "\n";
	return join(' ', @c);
}

# A couple of global options are set in here, they will be in the G:: namespace
sub process_args {
	my $o     = shift; # This is the args we got from command line
	my %n     = ();    # This is the hash we will return w/ the fixed-up args

	# handle the output file handles early so they can be used for errors
	# we don't need to keep track of the actual files but it will make debugging
	# easier later
	$G::trans_fh_oh = \*STDOUT;
	$G::trans_fh_of = "STDOUT";
	$G::trans_fh_eh = \*STDERR;
	$G::trans_fh_ef = "STDERR";
	if ($o->{output_file} && (!$o->{output_file_stderr} || !$o->{output_file_stdout})) {
		if (!open(OUTFH, ">>$o->{output_file}")) {
			ptrans(12, "Unable to open $o->{output_file} for writing\n");
			exit(1);
		}
		$G::trans_fh_oh = \*OUTFH;
		$G::trans_fh_of = $o->{output_file};
		$G::trans_fh_eh = \*OUTFH;
		$G::trans_fh_ef = $o->{output_file};
	}
	if ($o->{output_file_stderr}) {
		if (!open(OUTEFH, ">>$o->{output_file_stderr}")) {
			ptrans(12, "Unable to open $o->{output_file_stderr} for writing\n");
			exit(1);
		}
		$G::trans_fh_eh = \*OUTEFH;
		$G::trans_fh_ef = $o->{output_file_stderr};
	}
	if ($o->{output_file_stdout}) {
		if (!open(OUTOFH, ">>$o->{output_file_stdout}")) {
			ptrans(12, "Unable to open $o->{output_file_stdout} for writing\n");
			exit(1);
		}
		$G::trans_fh_oh = \*OUTOFH;
		$G::trans_fh_of = $o->{output_file_stdout};
	}
		

	$G::dump_args          = 1 if ($o->{dump_args});
	$G::suppress_data      = 1 if ($o->{suppress_data});
	$G::no_hints_send      = 1 if ($o->{no_hints_send} || $o->{no_hints});
	$G::no_hints_recv      = 1 if ($o->{no_hints_recv} || $o->{no_hints});
	$G::no_hints_info      = 1 if ($o->{no_hints_info});
	$G::hide_send          = 1 if ($o->{hide_send});
	$G::hide_receive       = 1 if ($o->{hide_receive});
	$G::hide_informational = 1 if ($o->{hide_informational});
	$G::hide_all           = 1 if ($o->{hide_all});
	$G::show_raw_text      = 1 if ($o->{show_raw_text});
	$G::protect_prompt     = 1 if ($o->{protect_prompt});
	$G::pipeline           = 1 if ($o->{pipeline});
	$G::silent             = $o->{silent} || 0;

	# it is an error if >1 of --server, --socket, or --pipe is specified
	if ((defined($o->{mail_server}) && defined($o->{socket}))   ||
	    (defined($o->{mail_server}) && defined($o->{pipe_cmd})) ||
	    (defined($o->{pipe_cmd})    && defined($o->{socket})))
	{
		ptrans(12, "Multiple transport types specified, exiting");
		exit(1);
	}

	my %protos = ( 
		smtp    => { proto => 'smtp',  auth => 0, tls => '0' },
		ssmtp   => { proto => 'esmtp', auth => 0, tls => 'c' },
		ssmtpa  => { proto => 'esmtp', auth => 1, tls => 'c' },
		smtps   => { proto => 'smtp',  auth => 0, tls => 'c' },
		esmtp   => { proto => 'esmtp', auth => 0, tls => '0' },
		esmtpa  => { proto => 'esmtp', auth => 1, tls => '0' },
		esmtps  => { proto => 'esmtp', auth => 0, tls => 's' },
		esmtpsa => { proto => 'esmtp', auth => 1, tls => 's' },
		lmtp    => { proto => 'lmtp',  auth => 0, tls => '0' },
		lmtpa   => { proto => 'lmtp',  auth => 1, tls => '0' },
		lmtps   => { proto => 'lmtp',  auth => 0, tls => 's' },
		lmtpsa  => { proto => 'lmtp',  auth => 1, tls => 's' },
	);
	$G::protocol = lc($o->{mail_protocol}) || 'esmtp';
	if (!$protos{$G::protocol}) {
		ptrans(12, "Unknown protocol $G::protocol specified, exiting");
		exit(1);
	}
	if ($protos{$G::protocol}{auth} && !$o->{auth_user}     && 
	    !$o->{auth_pass}            && !$o->{auth_optional} &&
	    !$o->{auth_optional_strict} && !$o->{auth})
	{
		$o->{auth} = ''; # cause auth to be processed below
	}
	if ($protos{$G::protocol}{tls} && !$o->{tls} && !$o->{tls_optional} &&
	    !$o->{tls_optional_strict} && !$o->{tls_on_connect})
	{
		# 'touch' the variable so we process it below
		if ($protos{$G::protocol}{tls} eq 's') {
			$o->{tls} = '';
		} elsif ($protos{$G::protocol}{tls} eq 'c') {
			$o->{tls_on_connect} = '';
		}
	}
	$G::protocol = $protos{$G::protocol}{proto};

	# set global option of -q option
	if ($o->{quit_after}) {
		$G::quit_after = lc($o->{quit_after});
		if ($G::quit_after =~ /^[el]hlo$/)        { $G::quit_after = 'helo';       }
		elsif ($G::quit_after =~ /first-[el]hlo/) { $G::quit_after = 'first-helo'; }
		elsif ($G::quit_after eq 'starttls')      { $G::quit_after = 'tls';        }
		elsif ($G::quit_after eq 'banner')        { $G::quit_after = 'connect';    }
		elsif ($G::quit_after eq 'from')          { $G::quit_after = 'mail';       }
		elsif ($G::quit_after eq 'to')            { $G::quit_after = 'rcpt';       }
		elsif ($G::quit_after ne 'connect' && $G::quit_after ne 'first-helo' &&
		       $G::quit_after ne 'tls'     && $G::quit_after ne 'helo'       &&
		       $G::quit_after ne 'auth'    && $G::quit_after ne 'mail'       &&
		       $G::quit_after ne 'rcpt'    && $G::quit_after ne 'xclient')
		{
			ptrans(12, "Unknown quit value $G::quit_after, exiting");
			exit(1);
		}
		# only rcpt _requires_ a to address
		$G::server_only = 1 if ($G::quit_after ne 'rcpt');
	} else {
		$G::quit_after = '';
	}

	# set global flag for -stl flag
	$G::show_time_lapse = time() if (defined($o->{show_time_lapse}));
	$G::show_time_hires = 1      if ($G::show_time_lapse && avail("hires_timing") &&
	                                                        $o->{show_time_lapse} !~ /^i/i);

	# pipe command, if one is specified
	$G::link{process}   = $o->{pipe_cmd} || interact("Pipe: ", '^.+$')
		if (defined($o->{pipe_cmd}));
	if ($G::link{process}) { $G::link{type} = 'pipe';   }
	else                   { delete($G::link{process}); }

	# socket file, if one is specified
	$G::link{sockfile}   = $o->{socket} || interact("Socket File: ", '^.+$')
		if (defined($o->{socket}));
	if ($G::link{sockfile}) { $G::link{type} = 'socket-unix'; }
	else                    { delete($G::link{sockfile});     }

	my $user     = get_username($o->{force_getpwuid});
	my $hostname = get_hostname();

	# SMTP mail from
	$n{from}   = $o->{mail_from} || interact("From: ", '^.*$')
		if (defined($o->{mail_from}));
	$n{from} ||= ($hostname || ($G::server_only && $G::quit_after ne 'mail')
	              ? "$user\@$hostname"
	              : interact("From: ", '^.*$'));
	$n{from}   = '' if ($n{from} eq '<>');

	# local interface to connect from
	$G::link{lint}   = $o->{lint} || interact("Interface: ", '^.*$')
		if (defined($o->{lint}));
	if ($G::link{lint}) {
		($G::link{lint},$o->{lport}) = parse_server($G::link{lint}, $o->{lport});
	}

	# SMTP helo/ehlo
	$n{helo}   = $o->{mail_helo} || interact("Helo: ", '^.*$')
		if (defined($o->{mail_helo}));
	$n{helo} ||= ($hostname || ($G::quit_after eq 'connect')
	              ? $hostname
	              : interact("Helo: ", '^.*$'));

	# SMTP server and rcpt to are interdependant, so they are handled together
	$G::link{server}   = $o->{mail_server} || interact("Server: ", '^.*$')
		if (defined($o->{mail_server}));
	($G::link{server},$o->{mail_port}) = parse_server($G::link{server}, $o->{mail_port});
	$n{to}             = $o->{mail_to} || interact("To: ", '^.*$')
		if (defined($o->{mail_to}));
	$n{to}             = interact("To: ", '^.*$')
		if (!$n{to} && !($G::server_only &&
		   ($G::link{server} || $G::link{type} eq 'socket-unix' || $G::link{type} eq 'pipe')));
	$G::link{type} ||= 'socket-inet';
	#if (!$G::link{type}) {
	#	$G::link{server} = get_server($o->{copy_routing} ?  $o->{copy_routing} : $n{to}) if (!$G::link{server});
	#	$G::link{type}   = "socket-inet";
	#}
	
	# try to catch obvious -s/-li/-4/-6 errors as soon as possible.  We don't actually do any DNS
	# lookups ourselves, so errors like -s being a domain with only A RRs and -li being a domain 
	# with only AAAA RRs, or -s being an ipv6 and -li being a domain with only A RRs, will
	# get passed into the IO::Socket module to deal with and will just registed as a connection
	# failure.
	if ($G::link{type} eq 'socket-inet') {
		if ($o->{force_ipv4} && $o->{force_ipv6}) {
			ptrans(12, "Options -4 and -6 are mutually exclusive, cannot proceed");
			exit 1;
		} elsif ($o->{force_ipv6}) {
			$G::link{force_ipv6} = 1;
		} elsif ($o->{force_ipv4}) {
			$G::link{force_ipv4} = 1;
		}
		
		$G::link{server} ||= get_server($o->{copy_routing} ?  $o->{copy_routing} : $n{to});
		
		if ($o->{force_ipv4} && $G::link{server} =~ m|:|) {
			ptrans(12, "Option -4 is set but server appears to be ipv6, cannot proceed");
			exit 1;
		} elsif ($o->{force_ipv4} && $G::link{lint} =~ m|:|) {
			ptrans(12, "Option -4 is set but local-interface appears to be ipv6, cannot proceed");
			exit 1;
		} elsif ($o->{force_ipv6} && $G::link{server} =~ m|^\d+\.\d+\.\d+\.\d+$|) {
			ptrans(12, "Option -6 is set but server appears to be ipv4, cannot proceed");
			exit 1;
		} elsif ($o->{force_ipv6} && $G::link{lint} =~ m|^\d+\.\d+\.\d+\.\d+$|) {
			ptrans(12, "Option -6 is set but local-interface appears to be ipv4, cannot proceed");
			exit 1;
		} elsif ($G::link{server} =~ m|:| && $G::link{lint} =~ m|^\d+\.\d+\.\d+\.\d+$|) {
			ptrans(12, "server is ipv6 but local-interface is ipv4, cannot proceed");
			exit 1;
		} elsif ($G::link{server} =~ m|^\d+\.\d+\.\d+\.\d+$| && $G::link{lint} =~ m|:|) {
			ptrans(12, "server is ipv4 but local-interface is ipv6, cannot proceed");
			exit 1;
		}
	}
	
	# Verify we are able to handle the requested transport
	if ($G::link{type} eq 'pipe') {
		if (!avail("pipe")) {
			ptrans(12, avail_str("pipe").".  Exiting");
			exit(10);
		}
	} else {
		if (!avail("socket")) {
			ptrans(12, avail_str("socket").".  Exiting");
			exit(10);
		} elsif (($o->{force_ipv6} || $G::link{server} =~ m|:| ||  $G::link{lint} =~ m|:|) && !avail("ipv6")) {
			ptrans(12, avail_str("ipv6").".  Exiting");
			exit(10);
		}
	}

	# SMTP timeout
	$o->{timeout}       = '0s' if ($o->{timeout} eq '0'); # used 'eq' on purpose
	$G::link{timeout}   = $o->{timeout} || interact("Timeout: ", '^\d+[hHmMsS]?$')
		if (defined($o->{timeout}));
	$G::link{timeout} ||= '30s';
	$G::link{timeout}   = time_to_seconds($G::link{timeout});

	$o->{dump_as_body} = 1 if ($o->{dab_sp});
	my $body  = 'This is a test mailing'; # default message body
	$body = 'DUMP_AS_BODY_HAS_BEEN_SET' if ($o->{dump_as_body});
	my $bound = "";
	my $stdin = undef;
	if (defined($o->{body_822})) {
		# the --body option is the entire 822 body and trumps and other options
		# that mess with the body
		if (!$o->{body_822}) {
			$body = interact("Body: ", '.+');
		} elsif ($o->{body_822} eq '-') {
			$stdin = join('', <STDIN>);
			$body  = $stdin;
		} else {
			$body = $o->{body_822};
		}
		if (open(I, "<$body")) {
			$body = join('', <I>);
			close(I);
		}
	}
	if (defined($o->{attach_822}) && ref($o->{attach_822}) eq 'ARRAY' && scalar(@{$o->{attach_822}})) {
		# this option is a list of files (or STDIN) to attach.  In this case,
		# the message become a mime message and the "body" goes in the
		# first text/plain part
		my $mime_type = 'application/octet-stream';
		my $next_name = undef();
		my @parts     = ( { body => $body, type => 'text/plain' } );
		$bound        = "----=_MIME_BOUNDARY_000_$$";
		while (defined(my $t = shift(@{$o->{attach_822}}))) {
			if ($t =~ m|^[^/]+/[^/]+$| && !stat($t)) {
				$mime_type = $t;
			} elsif ($t =~ /^FILENAME:(.*)$/) {
				$next_name = $1;
			} else {
				push(@parts, { body => "$t", type => $mime_type });
				if (defined($next_name)) {
					$parts[-1]{name} = $next_name;
					$next_name       = undef();
				}
			}
		}
		$body = '';
		foreach my $p (@parts) {
			if ($p->{body} eq '-') {
				if ($stdin) {
					$p->{body} = $stdin;
				} else {
					$p->{body} = join('', <STDIN>);
					$stdin     = $p->{body};
				}
			} elsif (open(I, "<$p->{body}")) {
				if (!exists($p->{name})) {
					($p->{name}) = $p->{body} =~ m|/?([^/]+)$|;
				}
				$p->{body} = join('', <I>);
				close(I);
			}
			$body .= "--$bound\n";
			if ($p->{type} =~ m|^text/plain$|i && !$p->{name}) {
				$body .= "Content-Type: $p->{type}\n\n" . $p->{body} . "\n";
			} else {
				if ($p->{name}) {
					$body .= "Content-Type: $p->{type}; name=\"$p->{name}\"\n"
					      .  "Content-Description: $p->{name}\n"
					      .  "Content-Disposition: attachment; filename=\"$p->{name}\"\n";
				} else {
					$body .= "Content-Type: $p->{type}\n"
					      .  "Content-Disposition: attachment\n";
				}
				$body .= "Content-Transfer-Encoding: BASE64\n"
				      .  "\n" . eb64($p->{body}, "\n") . "\n";
			}
		}
		$body .= "--$bound--\n";
	}

	# add-header option.  In a strict technical sense this is only a text
	# string that will replace %NEW_HEADERS% in the DATA.  Because of where
	# %NEW_HEADERS% is placed in the default DATA, in practice this is used
	# to add headers to the stock DATA w/o having to craft a custom DATA portion
	@{$o->{add_header}} = map { split(/\\n/) } @{$o->{add_header}};

	# SMTP DATA
	# a '-' arg to -d is the same as setting -g
	if ($o->{mail_data} eq '-') {
		undef($o->{mail_data});
		$o->{data_on_stdin} = 1;
	}
	if (defined($o->{mail_data}) && !defined($o->{data_on_stdin})) {
		$n{data} = $o->{mail_data} || interact("Data: ", '^.*$');
	}
	$n{data} ||= 'Date: %DATE%\nTo: %TO_ADDRESS%\nFrom: %FROM_ADDRESS%\nSubject: test %DATE%\n' .
	            "X-Mailer: swaks v$p_version jetmore.org/john/code/swaks/".'\n' .
	            ($bound ? 'MIME-Version: 1.0\nContent-Type: multipart/mixed; boundary="'.$bound.'"\n' : '') .
	            '%NEW_HEADERS%' . # newline will be added in replacement if it exists
	            '\n' .
	            '%BODY%\n';
	# The -g option trumps all other methods of getting the data
	if ($o->{data_on_stdin}) {
		$n{data} = join('', <STDIN>);
	} elsif ($n{data} !~ m/(\\n|\n)/ && open(F, "<$n{data}")) {
		$n{data} = join('', <F>);
		close(F);
	}
	if (!$o->{no_data_fixup}) {
		$n{data} =~ s/%BODY%/$body/g;
		$n{data} =~ s/%B/$body/g if ($O{use_old_data_tokens});
		if (defined($o->{header}) && ref($o->{header}) eq 'ARRAY' && scalar(@{$o->{header}})) {
			foreach my $l (map { split(/\\n/) } @{$o->{header}}) {
				if (my($h) = $l =~ /^([^:]+):/) {
					if ($n{data} !~ s/(^|\\n|\n)$h:.*?($|\\n|\n)/$1$l$2/) {
						push(@{$o->{add_header}}, $l);
					}
				} else {
					push(@{$o->{add_header}}, $l);
				}
			}
		}
		$n{add_header} = join('\n', @{$o->{add_header}}) . "\n" if (@{$o->{add_header}});
		if ($n{data} =~ /%NEW_HEADERS%/ || ($O{use_old_data_tokens} && $n{data} =~ /%H/)) {
			$n{data} =~ s/%NEW_HEADERS%/$n{add_header}/g;
			$n{data} =~ s/%H/$n{add_header}/g if ($O{use_old_data_tokens});
		} else {
			$n{data} =~ s/(\n|\\n)(\r?\n|\\n)/$1$n{add_header}$2/;
		}
		$n{data} =~ s/\\n/\r\n/g;
		$n{data} =~ s/%FROM_ADDRESS%/$n{from}/g;
		$n{data} =~ s/%F/$n{from}/g if ($O{use_old_data_tokens});
		$n{data} =~ s/%TO_ADDRESS%/$n{to}/g;
		$n{data} =~ s/%T/$n{to}/g   if ($O{use_old_data_tokens});
		{  # braces are to limit scope of $date_string
			my $date_string = get_date_string();
			$n{data} =~ s/%DATE%/$date_string/g;
			$n{data} =~ s/%D/$date_string/g if ($O{use_old_data_tokens});
		}
		$n{data} =~ s/^From [^\n]*\n// if (!$O{no_strip_from});
		$n{data} =~ s/\r?\n\.\r?\n?$//s;   # If there was a trailing dot, remove it
		$n{data} =~ s/\n\./\n../g;         # quote any other leading dots
		# translate line endings - run twice to get consecutive \n correctly
		$n{data} =~ s/([^\r])\n/$1\r\n/gs;
		$n{data} =~ s/([^\r])\n/$1\r\n/gs; # this identical call is not a bug
		$n{data} .= "\r\n.";               # add a trailing dot
	}

	# Handle TLS options
	# tls => 0 - no.  STARTTLS must be advertised and must succeed, else error.
	#        1 - yes.  Success if not advertised, advertised and fails _or_ succeeds.
	#        2 - strict.  Satisfied if not advertised, or advertised and succeeded.
	#                     However, if it's advertised and fails, it's an error.
	$G::tls_optional      = 1 if (defined($o->{tls_optional}));
	$G::tls_optional      = 2 if (defined($o->{tls_optional_strict}));
	$G::tls               = 1 if (defined($o->{tls}) || $G::tls_optional);
	$G::tls_on_connect    = 1 if (defined($o->{tls_on_connect}));
	$G::link{tls}{active} = 0;
	if ($G::tls || $G::tls_on_connect) {
		if (!avail("tls")) {
			if ($G::tls_optional) {
				$G::tls = undef; # so we won't try it later
				ptrans(12,avail_str("tls"));
			} else {
				ptrans(12,avail_str("tls").".  Exiting");
				exit(10);
			}
		}
		$G::tls_verify  = 1 if (defined($o->{tls_verify}));
		$G::tls_cipher  = $o->{tls_cipher};
		$G::tls_cert    = $o->{tls_cert};
		$G::tls_key     = $o->{tls_key};
		if (($G::tls_cert || $G::tls_key) && !($G::tls_cert && $G::tls_key)) {
			ptrans(12, "--tls-cert and --tls-key require each other.  Exiting");
			exit(1);
		}
		if ($o->{tls_ca_path}) {
			$G::tls_ca_path = $o->{tls_ca_path};
			if (!-f $G::tls_ca_path && !-d $G::tls_ca_path) {
				ptrans(12, "--tls-ca-path: $G::tls_ca_path is not a valid file or directory.  Exiting.");
				exit(1);
			}
		}
		
		# this is kind of a kludge.  There doesn't appear to be a specific openssl call to find supported
		# protocols, but the OP_NO_protocol functions exist for supported protocols.  Loop through
		# "known" protocols (which will unfortunately need to be added-to by hand when new protocols
		# become available) to find out which of them are available
		@G::tls_supported_protocols = ();
		foreach my $p (qw(SSLv2 SSLv3 TLSv1 TLSv1_1 TLSv1_2)) {
			eval { no strict "refs"; &{"Net::SSLeay::OP_NO_$p"}(); };
			push(@G::tls_supported_protocols, $p) if (!$@);
		}
		
		if ($o->{tls_protocol}) {
			@G::tls_protocols = ();
			my @requested = split(/,\s*/, $o->{tls_protocol});
			if (my $c = scalar(grep(/^no_/i, @requested))) {
				if ($c != scalar(@requested)) {
					ptrans(12, "cannot mix X and no_X forms in --tls-protocol option");
					exit(1);
				}
			}
			foreach my $p (@requested) {
				my $t = $p;
				$t =~ s/^no_//i;
				if (grep /^$t$/i, @G::tls_supported_protocols) {
					push(@G::tls_protocols, $p);
				} else {
					ptrans(12, "$p in --tls-protocol is not a known/supported protocol");
				}
			}
			if (!scalar(@G::tls_protocols)) {
				ptrans(12, "no valid arguments provided to --tls-protocol, exiting");
				exit(1);
			}
		}
		
		if ($o->{tls_get_peer_cert}) {
			$G::tls_get_peer_cert = $o->{tls_get_peer_cert};
		} elsif (defined($o->{tls_get_peer_cert})) {
			$G::tls_get_peer_cert = "STDOUT";
		}
	}

	# SMTP port
	$G::link{port}   = $o->{mail_port} || interact("Port: ", '^\w+$')
		if (defined($o->{mail_port}));
	if ($G::link{port}) {
		# in here, the user has either specified a port, or that they _want_
		# to, so if it isn't a resolvable port, keep prompting for another one
		my $o_port = $G::link{port};
		if ($G::link{port} !~ /^\d+$/) {
			$G::link{port} = getservbyname($G::link{port}, 'tcp');
			while (!$G::link{port}) {
				$G::link{port} = $o_port = interact("Unable to resolve port $o_port\nPort: ", '^\w+$');
				$G::link{port} = getservbyname($G::link{port}, 'tcp') if ($G::link{port} !~ /^\d+$/);
			}
		}
	} else {
		# in here, user wants us to use default ports, so try look up services,
		# use default numbers is service names don't resolve.  Never prompt user
		if ($G::protocol eq 'lmtp') {
			$G::link{port} = getservbyname('lmtp',  'tcp') || '24';
		} elsif ($G::tls_on_connect) {
			$G::link{port} = getservbyname('smtps', 'tcp') || '465';
		} else {
			$G::link{port} = getservbyname('smtp',  'tcp') || '25';
		}
	}

	# local port
	$G::link{lport}   = $o->{lport} || interact("Local Port: ", '^\w+$')
		if (defined($o->{lport}));
	
	# XCLIENT
	$G::xclient{try}  = 0;
	$G::xclient{attr} = {};
	foreach my $attr ('name', 'addr', 'port', 'proto', 'helo', 'login', 'reverse_name') {
		$G::xclient{attr}{uc($attr)} = $o->{"xclient_" . $attr} || interact("XCLIENT $attr: ", '^.+$')
			if (defined($o->{"xclient_" . $attr}));
	}
	$G::xclient{optional} = 1 if (defined($o->{xclient_optional}));
	$G::xclient{optional} = 2 if (defined($o->{xclient_optional_strict}));
	$G::xclient{raw}      = $o->{"xclient_raw"} || interact("XCLIENT string: ", '^.+$')
		if (defined($o->{"xclient_raw"}));
	#$G::xclient{after}    = $o->{"xclient_after"} || interact("XCLIENT quit after: ", '^.+$')
	#	if (defined($o->{"xclient_after"}));
	$G::xclient{try}      = 1 if ($G::xclient{raw} || scalar(keys(%{$G::xclient{attr}})));

	# Handle AUTH options
	# auth_optional => 0 - no.     Auth must be advertised and must succeed, else error.
	#                  1 - yes.    Success if not advertised, advertised and fails _or_ succeeds.
	#                  2 - strict. Satisfied if not advertised, or advertised and succeeded.
	#                              However, if it's advertised and fails, it's an error.
	$G::auth_optional = 1 if (defined($o->{auth_optional}));
	$G::auth_optional = 2 if (defined($o->{auth_optional_strict}));
	$o->{auth_types} = [];
	if ($o->{auth}) {
		@{$o->{auth_types}} = map { uc($_) } (split(/,/, $o->{auth}));
	} elsif ($o->{auth_optional_strict}) {
		@{$o->{auth_types}} = map { uc($_) } (split(/,/, $o->{auth_optional_strict}));
	} elsif ($o->{auth_optional}) {
		@{$o->{auth_types}} = map { uc($_) } (split(/,/, $o->{auth_optional}));
	} elsif (defined($o->{auth_user}) || defined($o->{auth_pass}) ||
	         $G::auth_optional        || (defined($o->{auth})     && !$o->{auth}))
	{
		$o->{auth_types}[0] = 'ANY';
		$o->{auth}          = 'ANY'; # this is checked below
		$G::auth_type       = 'ANY';
	}
	# if after that processing we've defined some auth type, do some more
	# specific processing
	if (scalar(@{$o->{auth_types}})) {
		# there's a lot of option processing below.  If any type looks like it
		# will succeed later, set this to true
		my $valid_auth_found = 0;

		# handle the --auth-map options plus our default mappings
		foreach (split(/\s*,\s*/, $o->{auth_map}),"PLAIN=PLAIN","LOGIN=LOGIN",
		                          "CRAM-MD5=CRAM-MD5","DIGEST-MD5=DIGEST-MD5",
		                          "CRAM-SHA1=CRAM-SHA1","NTLM=NTLM","SPA=NTLM","MSN=NTLM")
		{
			my($alias,$type)        = split(/=/, uc($_), 2);
			# this gives us a list of all aliases and what the alias
			$G::auth_map_f{$alias}  = $type;
			# this gives a list of all base types and any aliases for it.
			$G::auth_map_t{$type} ||= [];
			push(@{$G::auth_map_t{$type}}, $alias);
		}
		# Now handle the --auth-extra options
		foreach (split(/\s*,\s*/, $o->{auth_extra})) {
			my($keyword,$value)       = split(/=/, $_, 2);
			$keyword                  = uc($keyword);
			$G::auth_extras{$keyword} = $value;
		}
		# handle the realm/domain synonyms
		if ($G::auth_extras{DOMAIN}) {
			$G::auth_extras{REALM}  = $G::auth_extras{DOMAIN};
		} elsif ($G::auth_extras{DOMAIN}) {
			$G::auth_extras{DOMAIN} = $G::auth_extras{REALM};
		}
		if (!avail("auth")) { # check for general auth requirements
			if ($G::auth_optional == 2) {
				# we don't know yet if this is really an error.  If the server
				# doesn't advertise auth, then it's not really an error.  So just
				# save it in case we need it later
				$G::auth_unavailable = avail_str("auth");
				ptrans(12, avail_str("auth"));
			} elsif ($G::auth_optional == 1) {
				ptrans(12, avail_str("auth"). ".  Skipping optional AUTH");
			} else {
				ptrans(12, avail_str("auth"). ".  Exiting");
				exit(10);
			}
		} else {
			# if the user doesn't specify an auth type, create a list from our
			# auth-map data.  Simplifies processing later
			if ($o->{auth_types}[0] eq 'ANY') {
				$o->{auth_types} = [sort keys %G::auth_map_f];
			}

			foreach my $type (@{$o->{auth_types}}) {
				# we need to evaluate whether we will be able to run the auth types
				# specified by the user
				if (!$G::auth_map_f{$type}) {
					ptrans(12, "$type is not a recognized auth type, skipping");
				} elsif ($G::auth_map_f{$type} eq 'CRAM-MD5'   && !avail("auth_cram_md5")) {
					ptrans(12, avail_str("auth_cram_md5"))   if ($o->{auth} ne 'ANY');
				} elsif ($G::auth_map_f{$type} eq 'CRAM-SHA1'  && !avail("auth_cram_sha1")) {
					ptrans(12, avail_str("auth_cram_sha1"))  if ($o->{auth} ne 'ANY');
				} elsif ($G::auth_map_f{$type} eq 'NTLM'       && !avail("auth_ntlm")) {
					ptrans(12, avail_str("auth_ntlm"))       if ($o->{auth} ne 'ANY');
				} elsif ($G::auth_map_f{$type} eq 'DIGEST-MD5' && !avail("auth_digest_md5")) {
					ptrans(12, avail_str("auth_digest_md5")) if ($o->{auth} ne 'ANY');
				} else {
					$valid_auth_found = 1;
					push(@{$n{a_type}}, $type);
				}
			}

			if (!$valid_auth_found) {
				ptrans(12, "No auth types supported");
				if ($G::auth_optional == 2) {
					$G::auth_unavailable .= "No auth types supported";
				} elsif ($G::auth_optional == 1) {
					$n{a_user} = $n{a_pass} = $n{a_type} = undef;
				} else {
					exit(10);
				}
			} else {
				$n{a_user}   = $o->{auth_user} if (defined($o->{auth_user}));
				$n{a_user} ||= interact("Username: ", 'SKIP');
				$n{a_user}   = '' if ($n{a_user} eq '<>');

				$n{a_pass}   = $o->{auth_pass} if (defined($o->{auth_pass}));
				$n{a_pass} ||= interact("Password: ", 'SKIP', 1);
				$n{a_pass}   = '' if ($n{a_pass} eq '<>');

				$G::auth_showpt = 1 if (defined($o->{auth_showpt}));
				if (length($o->{auth_hidepw})) {
					$G::auth_hidepw = $o->{auth_hidepw};
				} elsif (defined($o->{auth_hidepw})) {
					$G::auth_hidepw = "PROVIDED_BUT_REMOVED";
				}
			}
		} # end avail("auth")
	} # end auth parsing
	
	# the very last thing we do is swap out the body if --dump-as-body used
	if ($o->{dump_as_body}) {
		$n{data} =~ s|DUMP_AS_BODY_HAS_BEEN_SET|get_running_state(\%n)|e;
		if ($o->{dab_sp}) {
			$n{data} =~ s%PROVIDED_BUT_REMOVED%$n{a_pass}%g;
		} elsif ($G::auth_hidepw) {
			$n{data} =~ s%PROVIDED_BUT_REMOVED%$G::auth_hidepw%g;
		}
	}

	return(\%n);
}

sub parse_server {
	my $server = shift;
	my $port   = shift;
	
	if ($server =~ m|^\[([^\]]+)\]:(.*)$|) {
		# [1.2.3.4]:25
		# [hostname]:25
		# [1:2::3]:25
		return($1, $2);
	} elsif ($server =~ m|^([^:]+):([^:]+)$|) {
		# 1.2.3.4:25
		# hostname:25
		return($1, $2);
	} elsif ($server =~ m|^\[?([^/\]]*)\]?/(\w+)$|) {
		# 1.2.3.4/25   [1.2.3.4]/25
		# hostname/25  [hostname]/25
		# 1:2::3/25    [1:2::3]/25
		return($1, $2);
	} elsif ($server =~ m|^\[([^\]]+)\]$|) {
		# [1.2.3.4]
		# [hostname]
		# [1:2::3]
		return($1, $port);
	}
	return($server, $port);
}

sub get_running_state {
	my $opts = shift;
	
	if ($G::running_state) {
		return($G::running_state);
	}
	my $s = '';
	
	$s .= "App Info:\n"
	   .  "  X-Mailer = $p_name v$p_version jetmore.org/john/code/swaks/\n"
	   .  "  Cmd Line = $0 $G::cmdline\n"
	   .  "\n";

	$s .= "Output Info:\n"
	   .  "  show_time_lapse    = " . ($G::show_time_lapse    ? "TRUE" : "FALSE") . "\n"
	   .  "  show_time_hires    = " . ($G::show_time_hires    ? "TRUE" : "FALSE") . "\n"
	   .  "  suppress_data      = " . ($G::suppress_data      ? "TRUE" : "FALSE") . "\n"
	   .  "  no_hints_send      = " . ($G::no_hints_send      ? "TRUE" : "FALSE") . "\n"
	   .  "  no_hints_recv      = " . ($G::no_hints_recv      ? "TRUE" : "FALSE") . "\n"
	   .  "  no_hints_info      = " . ($G::no_hints_info      ? "TRUE" : "FALSE") . "\n"
	   .  "  silent             = $G::silent\n"
	   .  "  hide_send          = " . ($G::hide_send          ? "TRUE" : "FALSE") . "\n"
	   .  "  hide_receive       = " . ($G::hide_receive       ? "TRUE" : "FALSE") . "\n"
	   .  "  hide_informational = " . ($G::hide_informational ? "TRUE" : "FALSE") ."\n"
	   .  "  hide_all           = " . ($G::hide_all           ? "TRUE" : "FALSE") . "\n"
	   .  "  trans_fh_of        = $G::trans_fh_of ($G::trans_fh_oh," . \*STDOUT . ")\n"
	   .  "  trans_fh_ef        = $G::trans_fh_ef ($G::trans_fh_eh," . \*STDERR . ")\n"
	   .  "\n";

	$s .= "Transport Info:\n"
	   .  "  type            = $G::link{type}\n"
	   .  "  server          = $G::link{server}\n"
	   .  "  port            = $G::link{port}\n"
	   .  "  local interface = $G::link{lint}\n"
	   .  "  local port      = $G::link{lport}\n"
	   .  "  sockfile        = $G::link{sockfile}\n"
	   .  "  process         = $G::link{process}\n"
	   .  "\n";

	$s .= "Protocol Info:\n"
	   .  "  protocol    = $G::protocol\n"
	   .  "  helo        = $opts->{helo}\n"
	   .  "  from        = $opts->{from}\n"
	   .  "  to          = $opts->{to}\n"
	   .  "  quit after  = $G::quit_after\n"
	   .  "  server_only = " . ($G::server_only ? "TRUE" : "FALSE") . "\n"
	   .  "  timeout     = $G::link{timeout}\n"
	   .  "  pipeline    = " . ($G::pipeline    ? "TRUE" : "FALSE") . "\n"
	   .  "\n";

	$s .= "XCLIENT Info:\n"
	   .  "  xclient     = ";
	if ($G::xclient{try}) {
		if ($G::xclient{optional} == 2)    { $s .= "optional-strict\n"; }
		elsif ($G::xclient{optional} == 1) { $s .= "optional\n";        }
		else                               { $s .= "yes\n";        }
		$s .= "  raw string  = " . ($G::xclient{raw} || 'no') . "\n";
		$s .= "  attributes  = " . join("\n".' 'x16,
		                           map { uc($_)."=".$G::xclient{attr}{$_} } (keys %{$G::xclient{attr}})) . "\n";
	} else {
		$s .= "no\n";
	}
	$s .= "\n";

	$s .= "TLS / Encryption Info:\n"
	   .  "  tls                 = ";
	if ($G::tls || $G::tls_optional) {
		if ($G::tls) {
			$s .= 'starttls (';
			if ($G::tls_optional == 2)    { $s .= "optional-strict)\n"; }
			elsif ($G::tls_optional == 1) { $s .= "optional)\n";        }
			else                          { $s .= "required)\n";        }
		}
		elsif ($G::tls_on_connect)      { $s .= "on connect (required)\n"; }
		$s .= "  peer cert           = $G::tls_get_peer_cert\n"
		   .  "  local cert          = $G::tls_cert\n"
		   .  "  local key           = $G::tls_key\n"
		   .  "  local cipher list   = $G::tls_cipher\n"
		   .  "  ca path             = $G::tls_ca_path\n"
		   .  "  verify server cert  = " . ($G::tls_verify ? "TRUE" : "FALSE") . "\n"
		   .  "  available protocols = " . join(', ', @G::tls_supported_protocols) . "\n"
		   .  "  requested protocols = " . join(', ', @G::tls_protocols) . "\n";
	}
	else                            { $s .= "no\n";                    }
	$s .= "\n";

	$s .= "Authentication Info:\n"
	   .  "  auth        = ";
	if ($opts->{a_type}) {
		if ($G::auth_optional == 2)    { $s .= 'optional-strict'; }
		elsif ($G::auth_optional == 1) { $s .= 'optional';        }
		else                           { $s .= 'yes';             }
		$s .= " type='" . join(',', @{$opts->{a_type}}) . "' user='$opts->{a_user}' pass='PROVIDED_BUT_REMOVED'\n";
		
		$s .= "  auth_extras = " . join(',', map { "$_=$G::auth_extras{$_}" } keys (%G::auth_extras)) . "\n";
		$s .= "  auth_showpt = " . ($G::auth_showpt ? "TRUE" : "FALSE") . "\n";
		$s .= "  auth map    = " . join("\n".' 'x16,
		                           map { "$_ = ". join(', ', @{$G::auth_map_t{$_}}) } (keys %G::auth_map_t)) . "\n";
	}
	else { $s .= "no\n"; }
	
	return $G::running_state = $s;
}

sub get_username {
	my $force_getpwuid = shift;
	if ($^O eq 'MSWin32') {
		require Win32;
		return Win32::LoginName();
	}
	if ($force_getpwuid) {
		return (getpwuid($<))[0];
	}
	return $ENV{LOGNAME} || (getpwuid($<))[0];
}

sub get_date_string {
	return($G::date_string) if (length($G::date_string) > 0);

	my $et = time();
	my @l  = localtime($et);
	my $o  = 0;

	if (!avail("date_manip")) {
		ptrans(12, avail_str("date_manip").".  Date strings will be in GMT");
		@l = gmtime($et);
	} else {
		my @g = gmtime($et);
		$o = (timelocal(@l) - timelocal(@g)) / 60;
		# Adjust to hours and minutes and not hours and hour-hundreths
		# See debian bug 646084
		$o = int($o / 60)*100 + ($o%60)*($o > 0 ? 1 : -1);
	}
	$G::date_string = sprintf("%s, %02d %s %d %02d:%02d:%02d %+05d",
	                          (qw(Sun Mon Tue Wed Thu Fri Sat))[$l[6]],
	                          $l[3],
	                          (qw(Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec))[$l[4]],
	                          $l[5]+1900, $l[2], $l[1], $l[0],
	                          $o);
}

# partially Cribbed from "Programming Perl" and MIME::Base64 v2.12
sub db64 {
	my $s =  shift;
	if (load("MIME::Base64")) {
		return(decode_base64($s));
	} else {
		$s =~ tr#A-Za-z0-9+/##cd;
		$s =~ s|=+$||;
		$s =~ tr#A-Za-z0-9+/# -_#;
		my $r = '';
		while ($s =~ s/(.{1,60})//s) {
			$r .= unpack("u", chr(32 + int(length($1)*3/4)) . $1);
		}
		return($r);
	}
}

# partially Cribbed from MIME::Base64 v2.12
sub eb64 {
	my $s =  shift;
	my $e =  shift || ''; # line ending to use "empty by default"
	if (load("MIME::Base64")) {
		return(encode_base64($s, $e));
	} else {
		my $l =  length($s);
		chomp($s = pack("u", $s));
		$s =~ s|\n.||gms;
		$s =~ s|\A.||gms;
		$s =~ tr#` -_#AA-Za-z0-9+/#;
		my $p = (3 - $l%3) % 3;
		$s =~ s/.{$p}$/'=' x $p/e if ($p);
		$s =~ s/(.{1,76})/$1$e/g  if (length($e));
		return($s);
	}
}

sub build_version {
	my $static = shift;
	my $svn    = shift;

	if ($static ne 'DEVRELEASE') {
		# if gen-util passed in a static version, use it unconditionally
		return $static;
	} elsif ($svn =~ /\$Id:\s+\S+\s+(\d+)\s+(\d+)-(\d+)-(\d+)\s+/) {
		# otherwise, this is a dev copy, dynamically build a version string for it
		return("$2$3$4.$1-dev");
	} else {
		# we wanted a dynamic version, but the SVN Id tag wasn't in the format
		# we expected, punt
		return("DEVRELEASE");
	}
}

sub ext_usage {
	if ($ARGV[0] =~ /^--help$/i) {
		require Config;
		$ENV{PATH} .= ":" unless $ENV{PATH} eq "";
		$ENV{PATH}  = "$ENV{PATH}$Config::Config{'installscript'}";
		$< = $> = 1 if ($> == 0 || $< == 0);
		exec("perldoc", $0) || exit(1);
		# make parser happy
		%Config::Config = ();
	} elsif ($ARGV[0] =~ /^--version$/i) {
		print "$p_name version $p_version\n\n$p_cp\n";
	} else {
		return;
	}

	exit(0);
}


=pod

=head1 NAME

swaks - Swiss Army Knife SMTP, the all-purpose smtp transaction tester

=head1 DESCRIPTION

swaks' primary design goal is to be a flexible, scriptable, transaction-oriented SMTP test tool.  It handles SMTP features and extensions such as TLS, authentication, and pipelining; multiple version of the SMTP protocol including SMTP, ESMTP, and LMTP; and multiple transport methods including unix-domain sockets, internet-domain sockets, and pipes to spawned processes.  Options can be specified in environment variables, configuration files, and the command line allowing maximum configurability and ease of use for operators and scripters.

=head1 QUICK START

Deliver a standard test email to user@example.com on port 25 of test-server.example.net:

=over 4

 swaks --to user@example.com --server test-server.example.net

=back

Deliver a standard test email, requiring CRAM-MD5 authentication as user me@example.com.  An "X-Test" header will be added to the email body.  The authentication password will be prompted for.

=over 4

 swaks --to user@example.com --from me@example.com --auth CRAM-MD5 --auth-user me@example.com --header-X-Test "test email"

=back

Test a virus scanner using EICAR in an attachment.  Don't show the message DATA part.:

=over 4

 swaks -t user@example.com --attach - --server test-server.example.com --suppress-data </path/to/eicar.txt

=back

Test a spam scanner using GTUBE in the body of an email, routed via the MX records for example.com:

=over 4

 swaks --to user@example.com --body /path/to/gtube/file

=back

Deliver a standard test email to user@example.com using the LMTP protocol via a UNIX domain socket file

=over 4

 swaks --to user@example.com --socket /var/lda.sock --protocol LMTP

=back

Report all the recipients in a text file that are non-verifyiable on a test server:

=over 4

 for E in `cat /path/to/email/file`
 do
     swaks --to $E --server test-server.example.com --quit-after RCPT --hide-all
     [ $? -ne 0 ] && echo $E
 done

=back

=head1 TERMS AND CONVENTIONS

This document tries to be consistent and specific in its use of the following terms to reduce confusion.

=over 4

=item Transaction

A transaction is the opening of a connection over a transport to a target and using a messaging protocol to attempt to deliver a message.

=item Target

The target of a transaction is the thing that swaks connects to.  This generic term is used throughout the documentation because most other terms improperly imply something about the transport being used.

=item Transport

The transport is the underlying method used to connect to the target.

=item Protocol

The protocol is the application language used to communicate with the target.  This document uses SMTP to speak generically of all three supported protocols unless it states that it is speaking of the specific 'SMTP' protocol and excluding the others.

=item Message

SMTP protocols exist to transfer messages, a set of bytes in an agreed-upon format that has a sender and a recipient.

=item Envelope

A message's envelope contains the "true" sender and receiver of a message.  It can also be referred to as its components, envelope-sender and envelope-recipients.  It is important to note that a messages envelope does not have to match its To: and From: headers.

=item DATA

The DATA portion of an SMTP transaction is the actual message that is being transported.  It consists of both the message's headers and its body.  DATA and body are sometimes use synonymously, but they are always two distinct things in this document.

=item Headers

A message's headers are defined as all the lines in the message's DATA section before the first blank line.  They contain information about the email that will be displayed to the recipient such as To:, From:, Subject:, etc.  In this document headers will always be written with a capitalized first letter and a trailing colon.

=item Body

A message's body is the portion of its DATA section following the first blank line.

=back

=head1 OPTION PROCESSING

To prevent potential confusion in this document a flag to swaks is always referred to as an "option".  If the option takes additional data, that additional data is referred to as an argument to the option.  For example, "--from fred@example.com" might be provided to swaks on the command line, with "--from" being the option and "fred@example.com" being --from's argument.

Options can be given to swaks in three ways.  They can be specified in a configuration file, in environment variables, and on the command line.  Depending on the specific option and whether or not an argument is given to it, swaks may prompt the user for the argument.

When swaks evaluates its options, it first looks for a configuration file (either in a default location or specified with --config).  Then it evaluates any options in environment variables.  Finally, it evaluates command line options.  At each round of processing, any options set earlier will be overridden.  Additionally, any option can be prefixed with "no-" to cause swaks to forget that the variable had previously been set.  This capability is necessary because many options treat defined-but-no-argument differently than not-defined.

The exact mechanism and format for using each of the types is listed below.

=over 4

=item CONFIGURATION FILE

A configuration file can be used to set commonly-used or abnormally verbose options.  By default swaks looks in order for $SWAKS_HOME/.swaksrc, $HOME/.swaksrc, and $LOGDIR/.swaksrc.  If one of those is found to exist (and --config has not been used) that file is used as the configuration file.

Additionally a configuration file in a non-default location can be specified using --config.  If this is set and not given an argument swaks will not use any configuration file, including any default file.  If --config points to a readable file, it is used as the configuration file, overriding any default that may exist.  If it points to a non-readable file and error will be shown and swaks will exit.

A set of "portable" defaults can also be created by adding options to the end of the swaks program file.  As distributed, the last line of swaks should be "__END__".  Any lines added after __END__ will be treated as the contents of a configuration file.  This allows a set of user preferences to be automatically copied from server to server in a single file.

If present and configuration files have not been explicitly turned off, the __END__ config is always read.  Only one other configuration file will ever be used per single invocation of swaks, even if multiple configuration files are specified.  Specifying the --config option with no argument turns off the processing of both the __END__ config and any actual config files.

In a configuration file lines beginning with a hash (#) are ignored.  All other lines are assumed to be an option to swaks, with the leading dash or dashes optional.  Everything after a option line's first space is assumed to be the option's argument and is not shell processed.  Therefore quoting is usually unneeded and will be included literally in the argument.  Here is an example of the contents of a configuration file:


    # always use this sender, no matter server or logged in user
    --from fred@example.com
    # I prefer my test emails have a pretty from header.  Note
    # the lack of dashes on option and lack of quotes around
    # entire argument.
    h-From: "Fred Example" <fred@example.com>

=item ENVIRONMENT VARIABLES

Options can be supplied via environment variables.  The variables are in the form $SWAKS_OPT_name, where name is the name of the option that would be specified on the command line.  Because dashes aren't allowed in environment variable names in most unix-ish shells, no leading dashes should be used and any dashes inside the option's name should be replaced with underscores.  The following would create the same options shown in the configuration file example:

    $ SWAKS_OPT_from='fred@example.com'
    $ SWAKS_OPT_h_From='"Fred Example" <fred@example.com>'

Setting a variable to an empty value is the same as specifying it on the command line with no argument.  For instance, setting SWAKS_OPT_server="" would cause swaks to prompt the use for the server to which to connect at each invocation.

In addition to setting the equivalent of command line options, SWAKS_HOME can be set to a directory containing the default .swaksrc to be used.

=item COMMAND LINE OPTIONS

The final method of supplying options to swaks is via the command line.  The options behave in a manner consistent with most unix-ish command line programs.  Many options have both a short and long form (for instance -s and --server).  By convention short options are specified with a single dash and long options are specified with a double-dash.  This is only a convention and either prefix will work with either type.

The following demonstrates the example shown in the configuration file and environment variable sections:

    $ swaks --from fred@example.com --h-From: '"Fred Example" <fred@example.com>'

=back

=head1 TRANSPORTS

swaks can connect to a target via unix pipes ("pipes"), unix domain sockets ("unix sockets"), or internet domain sockets ("network sockets").  Connecting via network sockets is the default behavior.  Because of the singular nature of the transport used, each set of options in the following section is mutually exclusive.  Specifying more than one of --server, --pipe, or --socket will result in an error.  Mixing other options between transport types will only result in the irrelevant options being ignored.  Below is a brief description of each type of transport and the options that are specific to that transport type.

=over 4

=item NETWORK SOCKETS

This transport attempts to deliver a message via TCP/IP, the standard method for delivering SMTP.  This is the default transport for swaks.  If none of --server, --pipe, or --socket are given then this transport is used and the target server is determined from the recipient's domain (see --server below for more details).

This transport requires the IO::Socket module which is part of the standard perl distribution.  If this module is not loadable, attempting to use a this transport will result in an error and program termination.

IPv6 is supported when the IO::Socket::INET6 module is present.

=over 4

=item -s, --server [target mail server[:port]]

Explicitly tell swaks to use network sockets and specify the hostname or IP address to which to connect, or prompt if no argument is given.  If this option is not given and no other transport option is given, the target mail server is determined from the appropriate DNS records for the domain of the recipient email address using the Net::DNS module.  If Net::DNS is not available swaks will attempt to connect to localhost to deliver.  The target port can optionally be set here.  Supported formats for this include SERVER:PORT (supporting names and IPv4 addresses); [SERVER]:PORT and SERVER/PORT (supporting names, IPv4 and IPv6 addresses).  See also --copy-routing.

=item -p, --port [port]

Specify which TCP port on the target is to be used, or prompt if no argument is listed.  The argument can be a service name (as retrieved by getservbyname(3)) or a port number.  The default port is determined by the --protocol option.  See --protocol for more details.

=item -li, --local-interface [IP or hostname[:port]]

Use argument as the local interface for the outgoing SMTP connection, or prompt user if no argument given.  Argument can be an IP address or a hostname.  Default action is to let the operating system choose local interface.  See --server for additional comments on :port format.

=item -lp, --local-port [port]

Specify the outgoing port to originate the transaction from.  If this option is not specified the system will pick an ephemeral port.  Note that regular users cannot specify some ports.

=item --copy-routing [domain]

The argument is interpreted as the domain part of an email address and it is used to find the target server using the same logic that would be used to look up the target server for an recipient email address.  See  --to option for more details on how the target is determined from the email domain.

=item -4, -6

Force IPv4 or IPv6.

=back

=item UNIX SOCKETS

This transport method attempts to deliver messages via a unix-domain socket file.  This is useful for testing MTA/MDAs that listen on socket files (for instance, testing LMTP delivery to Cyrus).  This transport requires the IO::Socket module which is part of the standard perl distribution.  If this module is not loadable, attempting to use this transport will result in an error and program termination.

=over 4

=item --socket [/path/to/socket/file]

This option takes as its argument a unix-domain socket file.  If swaks is unable to open this socket it will display an error and exit.

=back

=item PIPES

This transport attempts to spawn a process and communicate with it via pipes.  The spawned program must be prepared to behave as a mail server over STDIN/STDOUT.  Any MTA designed to operate from inet/xinet should support this.  In addition some MTAs provide testing modes that can be communicated with via STDIN/STDOUT.  This transport can be used to automate that testing.  For example, if you implemented DNSBL checking with Exim and you wanted to make sure it was working, you could run 'swaks --pipe "exim -bh 127.0.0.2"'.  In an ideal world the process you are talking to should behave exactly like an SMTP server on stdin and stdout.  Any debugging should be sent to stderr, which will be directed to your terminal.  In the real world swaks can generally handle some debug on the child's stdout, but there are no guarantees on how much it can handle.

This transport requires the IPC::Open2 module which is part of the standard perl distribution.  If this module is not loadable, attempting to use this transport will result in an error and program termination.

=over 4

=item --pipe [/path/to/command and arguments]

Provide a process name and arguments to the process.  swaks will attempt to spawn the process and communicate with it via pipes.  If the argument is not an executable swaks will display an error and exit.

=back

=back

=head1 PROTOCOL OPTIONS

These options are related to the protocol layer.

=over 4

=item -t, --to [email-address[,email-address,...]]

Tells swaks to use argument(s) as the envelope-recipient for the email, or prompt for recipient if no argument provided.  If multiple recipients are provided and the recipient domain is needed to determine routing the domain of the last recipient provided is used.

There is no default value for this option.  If no recipients are provided via any means, user will be prompted to provide one interactively.  The only exception to this is if a --quit-after value is provided which will cause the smtp transaction to be terminated before the recipient is needed.

=item -f, --from [email-address]

Use argument as envelope-sender for email, or prompt user if no argument specified.  The string <> can be supplied to mean the null sender.  If user does not specify a sender address a default value is used.  The domain-part of the default sender is a best guess at the fully-qualified domain name of the local host.  The method of determining the local-part varies.  On Windows, Win32::LoginName() is used.  On unix-ish platforms, the $LOGNAME environment variable is used if it is set.  Otherwise getpwuid(3) is used.  See also --force-getpwuid.

=item --ehlo, --lhlo, -h, --helo [helo-string]

String to use as argument to HELO/EHLO/LHLO command, or prompt use if no argument is specified.  If this option is not used a best guess at the fully-qualified domain name of the local host is used.  If the Sys::Hostname module, which is part of the base distribution, is not available the user will be prompted for a HELO value.  Note that Sys::Hostname has been observed to not be able to find the local hostname in certain circumstances.  This has the same effect as if Sys::Hostname were unavailable.

=item -q, --quit-after [stop-point]

Point at which the transaction should be stopped.  When the requested stopping point is reached in the transaction, and provided that swaks has not errored out prior to reaching it,  swaks will send "QUIT" and attempt to close the connection cleanly.  These are the valid arguments and notes about their meaning.

=over 4

=item CONNECT, BANNER

Terminate the session after receiving the greeting banner from the target.

=item FIRST-HELO, FIRST-EHLO, FIRST-LHLO

In a STARTTLS (but not tls-on-connect) session, terminate the transaction after the first of two HELOs.  In a non-STARTTLS transaction, behaves the same as HELO (see below).

=item XCLIENT

Quit after XCLIENT is sent

=item TLS

Quit the transaction immediately following TLS negotiation.  Note that this happens in different places depending on whether STARTTLS or tls-on-connect are used.  This always quits after the point where TLS would have been negotiated, regardless of whether it was attempted.

=item HELO, EHLO, LHLO

In a STARTTLS or XCLIENT session, quit after the second HELO.  Otherwise quit after the first and only HELO.

=item AUTH

Quit after authentication.  This always quits after the point where authentication would have been negotiated, regardless of whether it was attempted.

=item MAIL, FROM

Quit after MAIL FROM: is sent.

=item RCPT, TO

Quit after RCPT TO: is sent.

=back

=item --timeout [time]

Use argument as the SMTP transaction timeout, or prompt user if no argument given.  Argument can either be a pure digit, which will be interpretted as seconds, or can have a specifier s or m (5s = 5 seconds, 3m = 180 seconds).  As a special case, 0 means don't timeout the transactions.  Default value is 30s.

=item --protocol [protocol]

Specify which protocol to use in the transaction.  Valid options are shown in the table below.  Currently the 'core' protocols are SMTP, ESMTP, and LMTP.  By using variations of these protocol types one can tersely specify default ports, whether authentication should be attempted, and the type of TLS connection that should be attempted.  The default protocol is ESMTP.  This table demonstrates the available arguments to --protocol and the options each sets as a side effect:

=over 4

=item SMTP

HELO, "-p 25"

=item SSMTP

EHLO->HELO, "-tlsc -p 465"

=item SSMTPA

EHLO->HELO, "-a -tlsc -p 465"

=item SMTPS

HELO, "-tlsc -p 465"

=item ESMTP

EHLO->HELO, "-p 25"

=item ESMTPA

EHLO->HELO, "-a -p 25"

=item ESMTPS

EHLO->HELO, "-tls -p 25"

=item ESMTPSA

EHLO->HELO, "-a -tls -p 25"

=item LMTP

LHLO, "-p 24"

=item LMTPA

LHLO, "-a -p 24"

=item LMTPS

LHLO, "-tls -p 24"

=item LMTPSA

LHLO, "-a -tls -p 24"

=back

=item --pipeline

If the remote server supports it, attempt SMTP PIPELINING (RFC 2920).  This is a younger option, if you experience problems with it please notify the author.  Potential problem areas include servers accepting DATA even though there were no valid recipients (swaks should send empty body in that case, not QUIT) and deadlocks caused by sending packets outside the tcp window size.

=item --force-getpwuid

Tell swaks to use the getpwuid method of finding the default sender local-part instead of trying $LOGNAME first.

=back

=head1 TLS / ENCRYPTION

These are options related to encrypting the transaction.  These have been tested and confirmed to work with all three transport methods.  The Net::SSLeay module is used to perform encryption when it is requested.  If this module is not loadable swaks will either ignore the TLS request or error out, depending on whether the request was optional.  STARTTLS is defined as an extension in the ESMTP protocol and will be unavailable if --protocol is set to a variation of smtp.  Because it is not defined in the protocol itself, --tls-on-connect is available for any protocol type if the target supports it.

A local certificate is not required for a TLS connection to be negotiated.  However, some servers use client certificate checking to verify that the client is allowed to connect.  swaks can be told to use a specific local certificate through the use of the --tls-cert and --tls-key options.

=over 4

=item -tls

Require connection to use STARTTLS.  Exit if TLS not available for any reason (not advertised, negotiations failed, etc).

=item -tlso, --tls-optional

Attempt to use STARTTLS if available, continue with normal transaction if TLS was unable to be negotiated for any reason.  Note that this is a semi-useless option as currently implemented because after a negotiation failure the state of the connection is unknown.  In some cases, like a version mismatch, the connection should be left as plaintext.  In others, like a verification failure, the server-side may think that it should continue speaking TLS while the client thinks it is plaintext.  There may be an attempt to add more granular state detection in the future, but for now just be aware that odd things may happen with this option if the TLS negotiation is attempted and fails.

=item -tlsos, --tls-optional-strict

Attempt to use STARTTLS if available.  Proceed with transaction if TLS is negotiated successfully or STARTTLS not advertised.  If STARTTLS is advertised but TLS negotiations fail, treat as an error and abort transaction.  Due to the caveat noted above, this is a much more sane option than --tls-optional.

=item --tlsc, --tls-on-connect

Initiate a TLS connection immediately on connection.  Following common convention, if this option is specified the default port changes from 25 to 465, though this can still be overridden with the --port option.

=item -tlsp, --tls-protocol SPECIFICATION

Specify which protocols to use (or not use) when negotiating TLS.  At the time of this writing, the available protocols are sslv2, sslv3, tlsv1, tlsv1_1, and tlsv1_2.  The availability of these protocols is dependent on your underlying OpenSSL library, so not all of these may be available.  The list of available protocols is shown in the output of --dump (assuming TLS is available at all).

The specification string is a comma-delimited list of protocols that can be used or not used.  For instance 'tlsv1,tlsv1_1' will only succeed if one of those two protocols is available on both the client and the server.  Conversely, 'no_sslv2,no_sslv3' will attempt to negotiate any protocol except sslv2 and sslv3.  The two forms of specification cannot be mixed.

=item -tls-cipher CIPHER_STRING

Th argument to this option is passed to the underlying OpenSSL library to set the list of acceptable ciphers to the be used for the connection.  The format of this string is opaque to swaks and is defined in http://www.openssl.org/docs/apps/ciphers.html#CIPHER_LIST_FORMAT.  An brief example would be --tls-cipher '3DES:+RSA'.

=item --tls-verify

By default swaks does not do any certificate verification.  Setting --tls-verify will cause swaks to attempt to verify the server's certificate.  If this option is set and the server's certificate is not verifiable (either using the system-default CA information, or custom CA information (see --tls-ca-path)) TLS negotiation will not succeed.

=item --tls-ca-path [ /path/to/CAfile | /path/to/CAdir/ ]

By default swaks will use the underlying OpenSSL library's default CA information for verifying server certificates.  --tls-ca-path allows you to specify an alternate location.  See http://www.openssl.org/docs/ssl/SSL_CTX_load_verify_locations.html for details of the file/directory contents.

=item --tls-cert /path/to/file

Provide a path to a file containing the local certificate swaks should use if TLS is negotiated.  The file path argument is required.  As currently implemented the certificate in the file must be in PEM format.  Contact the author if there's a compelling need for ASN1.  If this option is set, --tls-key is also required.

=item --tls-key /path/to/file

Provide a path to a file containing the local private key swaks should use if TLS is negotiated.  The file path argument is required.  As currently implemented the certificate in the file must be in PEM format.  Contact the author if there's a compelling need for ASN1.  If this option is set, --tls-cert is also required.

=item --tls-get-peer-cert [/path/to/file]

Get a copy of the TLS peer's certificate.  If no argument is given, it will be displayed to STDOUT.  If an argument is given it is assumed to be a filesystem path specifying where the certificate should be written.  The saved certificate can then be examined using standard tools such as the openssl command.  If a file is specified its contents will be overwritten.

=back

=head1 AUTHENTICATION

swaks will attempt to authenticate to the target mail server if instructed to do so.  This section details available authentication types, requirements, options and their interactions, and other fine points in authentication usage.  Because authentication is defined as an extension in the ESMTP protocol it will be unavailable if --protocol is set to a variation of smtp.

All authentication methods require base64 encoding.  If the MIME::Base64 perl module is loadable swaks attempts to use it to perform these encodings.  If MIME::Base64 is not available swaks will use its own onboard base64 routines.  These are slower than the MIME::Base64 routines and less reviewed, though they have been tested thoroughly.  Using the MIME::Base64 module is encouraged.

If authentication is required (see options below for when it is and isn't required) and the requirements aren't met for the authentication type available, swaks displays an error and exits.  Two ways this can happen include forcing swaks to use a specific authentication type that swaks can't use due to missing requirements, or allowing swaks to use any authentication type, but the server only advertises types swaks can't support.  In the former case swaks errors out at option processing time since it knows up front it won't be able to authenticate.  In the latter case swaks will error out at the authentication stage of the smtp transaction since swaks will not be aware that it will not be able to authenticate until that point.

Following are the supported authentication types including any individual notes and requirements.

The following options affect swaks' use of authentication.  These options are all inter-related.  For instance, specifying --auth-user implies --auth and --auth-password.  Specifying --auth-optional implies --auth-user and --auth-password, etc.

=over 4

=item -a, --auth [auth-type[,auth-type,...]]

Require swaks to authenticate.  If no argument is given, any supported auth-types advertised by the server are tried until one succeeds or all fail.  If one or more auth-types are specified as an argument, each that the server also supports is tried in order until one succeeds or all fail.  This option requires swaks to authenticate, so if no common auth-types are found or no credentials succeed, swaks displays an error and exits.

The following tables lists the valid auth-types

=over 4

=item LOGIN, PLAIN

These basic authentication types are fully supported and tested and have no additional requirements

=item CRAM-MD5

The CRAM-MD5 authenticator requires the Digest::MD5 module.  It is fully tested and believed to work against any server that implements it.

=item DIGEST-MD5

The DIGEST-MD5 authenticator (RFC2831) requires the Authen::SASL module.  Version 20100211.0 and earlier used Authen::DigestMD5 which had some protocol level errors which prevented it from working with some servers.  Authen::SASL's DIGEST-MD5 handling is much more robust.

The DIGEST-MD5 implementation in swaks is fairly immature.  It currently supports only the "auth" qop type, for instance.  If you have DIGEST-MD5 experience and would like to help swaks support DIGEST-MD5 better, please get in touch with me.

The DIGEST-MD5 protocol's "realm" value can be set using the --auth-extra "realm" keyword.  If no realm is given, a reasonable default will be used.

The DIGEST-MD5 protocol's "digest-uri" values can be set using the --auth-extra option.  For instance, you could create the digest-uri-value of "lmtp/mail.example.com/example.com" with the option "--auth-extra dmd5-serv-type=lmtp,dmd5-host=mail.example.com,dmd5-serv-name=example.com".  The "digest-uri-value" string and its components is defined in RFC2831.  If none of these values are given, reasonable defaults will be used.

=item CRAM-SHA1

The CRAM-SHA1 authenticator requires the Digest::SHA module.  This type has only been tested against a non-standard implementation on an Exim server and may therefore have some implementation deficiencies.

=item NTLM/SPA/MSN

These authenticators require the Authen::NTLM module.  Note that there are two modules using the Authen::NTLM namespace on CPAN.  The Mark Bush implementation (Authen/NTLM-1.03.tar.gz) is the version required by swaks.  This type has been tested against Exim, Communigate, and Exchange 2007.

In addition to the standard username and password, this authentication type can also recognize a "domain".  The domain can be set using the --auth-extra "domain" keyword.  Note that this has never been tested with a mail server that doesn't ignore DOMAIN so this may be implemented incorrectly.

=back

=item -ao, --auth-optional [auth-type[,auth-type,...]]

This option behaves identically to --auth except that it requests authentication rather than requiring it.  If no common auth-types are found or no credentials succeed, swaks proceeds as if authentication had not been requested.

=item -aos, --auth-optional-strict [auth-type[,auth-type,...]]

This option is a compromise between --auth and --auth-optional.  If no common auth-types are found, swaks behaves as if --auth-optional were specified and proceeds with the transaction.  If swaks can't support requested auth-type, the server doesn't advertise any common auth-types, or if no credentials succeed, swaks behaves as if --auth were used and exits with an error.

=item -au, --auth-user [username]

Provide the username to be used for authentication, or prompt the user for it if no argument is provided.  The string <> can be supplied to mean an empty username.

=item -ap, --auth-password [password]

Provide the password to be used for authentication, or prompt the user for it if no argument is provided.  The string <> can be supplied to mean an empty password.

=item -ae, --auth-extra [KEYWORD=value[,...]]

Some of the authentication types allow extra information to be included in the authentication process.  Rather than add a new option for every nook and cranny of each authenticator, the --auth-extra option allows this information to be supplied.

The following table lists the currently recognized keywords and the authenticators that use them

=over 4

=item realm, domain

The realm and domain keywords are synonymous.  Using either will set the "domain" option in NTLM/MSN/SPA and the "realm" option in DIGEST-MD5

=item dmd5-serv-type

The dmd5-serv-type keyword is used by the DIGEST-MD5 authenticator and is used, in part, to build the digest-uri-value string (see RFC2831)

=item dmd5-host

The dmd5-host keyword is used by the DIGEST-MD5 authenticator and is used, in part, to build the digest-uri-value string (see RFC2831)

=item dmd5-serv-name

The dmd5-serv-name keyword is used by the DIGEST-MD5 authenticator and is used, in part, to build the digest-uri-value string (see RFC2831)

=back

=item -am, --auth-map [auth-alias=auth-type[,...]]

Provides a way to map alternate names onto base authentication types.  Useful for any sites that use alternate names for common types.  This functionality is actually used internally to map types SPA and MSN onto the base type NTLM.  The command line argument to simulate this would be "--auth-map SPA=NTLM,MSN=NTLM".  All of the auth-types listed above are valid targets for mapping except SPA and MSN.

=item -apt, --auth-plaintext

Instead of showing AUTH strings base64 encoded as they are transmitted, translate them to plaintext before printing on screen.

=item -ahp, --auth-hide-password [replacement string]

If this option is specified, any time a readable password would be printed to the terminal (specifically AUTH PLAIN and AUTH LOGIN) the password is replaced with a dummy string (or the contents of "replacement string" if provided).  The dummy string will be base64 encoded or not contingent on the --auth-plaintext option.

Note that --auth-hide-password is similar, but not identical, to the --protect-prompt option.  The former protects passwords from being displayed in the SMTP transaction regardless of how they are entered.  The latter protects sensitive strings when the user types them at the terminal, regardless of how the string would be used.

=back

=head1 XCLIENT OPTIONS

XCLIENT is an SMTP extension introduced by the Postfix project.  XCLIENT allows a (properly-authorized) client to tell a server to use alternate information, such as IP address or hostname, for the client.  This allows much easier paths for testing mail server configurations.  Full details on the protocol are available at http://www.postfix.org/XCLIENT_README.html.

=over 4

=item --xclient-addr [VALUE]

=item --xclient-name [VALUE]

=item --xclient-port [VALUE]

=item --xclient-proto [VALUE]

=item --xclient-helo [VALUE]

=item --xclient-login [VALUE]

=item --xclient-reverse-name [VALUE]

These options specify XCLIENT attrubutes that should be sent to the target server.  If [VALUE] is not provided, swaks will prompt and read the value on STDIN.  See http://www.postfix.org/XCLIENT_README.html for official documentation for what the attributes mean and their possible values, including the special "[UNAVAILABLE]" and "[TEMPUNAVAIL]" values.

By way of simple example, setting "--xclient-name foo.example.com --xclient-addr 192.168.1.1" will cause swaks to send the SMTP command "XCLIENT NAME=foo.example.com ADDR=192.168.1.1".

Note that the "REVERSE_NAME" attribute doesn't seem to appear in the official documentation.  There is a mailing list thread that documents it, viewable at http://comments.gmane.org/gmane.mail.postfix.user/192623.

These options can all be mixed with each other, and can be mixed with the --xclient option (see below).

=item --xclient [XCLIENT_STRING]

This is the "free form" XCLIENT option.  Whatever value is provided for XCLIENT_STRING will be sent verbatim as the argument to the XCLIENT smtp command.  For example, if "--xclient 'NAME= ADDR=192.168.1.1 FOO=bar'" is used, swaks will send the SMTP command "XCLIENT NAME= ADDR=192.168.1.1 FOO=bar".  The primary advantage to this over the more specific options above is that there is no XCLIENT syntax validation here.  This allows you to send invalid XCLIENT to the target server for testing.  If no XCLIENT_STRING is passed on command line, swaks will prompt and read the value on STDIN.

The --xclient option can be mixed freely with the --xclient-* options above.  If "--xclient-addr 192.168.0.1 --xclient 'FOO=bar NAME=wind'" is given to swaks, "XCLIENT ADDR=192.168.0.1 FOO=bar NAME=wind" will be sent to the target server.

=item --xclient-optional

=item --xclient-optional-strict

In normal operation, setting one of the --xclient* options will cause a successful XCLIENT transaction to take place in order to proceed (that is, XCLIENT needs to be advertised, all the user-requested attributes need to have been advertised, and the server needs to have accepted swaks' XCLIENT request).  These options change that behavior.  --xclient-optional tells swaks to proceed unconditionally past the XCLIENT stage of the SMTP transaction, regardless of whether it was successful.  --xclient-optional-strict is similar but more granular.  The strict version will continue to XCLIENT was not advertised, but will fail if XCLIENT was attempted but did not succeed.

=back

=head1 DATA OPTIONS

These options pertain to the contents for the DATA portion of the SMTP transaction.

=over 4

=item -d, --data [data-portion]

Use argument as the entire contents of DATA, or prompt user if no argument specified.  If the argument '-' is provided the data will be read from STDIN.  If any other argument is provided and it represents the name of an open-able file, the contents of the file will be used.  Any other argument will be itself for the DATA contents.

The value can be on one single line, with \n (ascii 0x5c, 0x6e) representing where line breaks should be placed.  Leading dots will be quoted.  Closing dot is not required but is allowed.  The default value for this option is "Date: %DATE%\nTo: %TO_ADDRESS%\nFrom: %FROM_ADDRESS%\nSubject: test %DATE%\nX-Mailer: swaks v$p_version jetmore.org/john/code/swaks/\n%NEW_HEADERS%\n%BODY%\n".

Very basic token parsing is performed on the DATA portion.  See --use-old-data-tokens for details about the single-character tokens marked as deprecated.  The following table shows the recognized tokens and their replacement values:

=over 4

=item %FROM_ADDRESS%

Replaced with the envelope-sender.  Replaces the deprecated %F token.

=item %TO_ADDRESS%

Replaced with the envelope-recipient(s).  Replaces the deprecated %T token.

=item %DATE%

Replaced with the current time in a format suitable for inclusion in the Date: header.  Note this attempts to use the standard module Time::Local for timezone calculations.  If this module is unavailable the date string will be in GMT.  Replaces the deprecated %D token.

=item %NEW_HEADERS%

Replaced with the contents of the --add-header option.  If --add-header is not specified this token is simply removed.  Replaces the deprecated %H token.

=item %BODY%

Replaced with the value specified by the --body option.  See --body for default.  Replaces the deprecated %H token.

=back

=item --use-old-data-tokens

In previous versions of swaks the DATA tokens as described in the --data option above used single-character tokens (e.g., %F).  These were not a great choice for default tokens, and proved especially troublesome with encoded, non-english languages where these character combinations might be common.  The single-character tokens were replaced with the slightly-less-error-prone versions listed above.  The retention of the old tokens and the inclusion of this option to activate them are intended as a temporary aid to users who have an existing message corpus using the old tokens.  The single-character tokens and the --use-old-data-tokens option should be considered deprecated and likely to be removed in the next release.

=item -dab, --dump-as-body

If --dump-as-body is used and no other option is used to changed the default body of the message, the body is replaced with output similar to the output of what is provided by --dump.  --dump's initial program capability stanza is not displayed, and the "data" section is not included.  Additionally, --dump always includes passwords.  By default --dump-as-body does not include passwords, though this can be changed with --dump-as-body-shows-password.

=item -dabsp, --dump-as-body-shows-password

Cause --dump-as-body to include plaintext passwords.  This option is not recommended.  This option implies --dump-as-body.

=item --body [body-specification]

Specify the body of the email.  The default is "This is a test mailing".  If no argument to --body is given, prompt to supply one interactively.  If '-' is supplied, the body will be read from standard input.  If any other text is provided and the text represents an open-able file, the content of that file is used as the body.  If it does not represent an open-able file, the text itself is used as the body.

If the message is forced to MIME format (see --attach) the argument to this option will be included unencoded as the first MIME part.  Its content-type will always be text/plain.

=item --attach [attachment-specification]

When one or more --attach option is supplied, the message is changed into a multipart/mixed MIME message.  The arguments to --attach are processed the same as --body with regard to stdin, file contents, etc.  --attach can be supplied multiple times to create multiple attachments.  By default each attachment is attached as a application/octet-stream file.  See --attach-type for changing this behavior.

If a filename is specified, the MIME encoding will include that file name.  See --attach-name for more detail on file naming.

It is legal for '-' (STDIN) to be specified as an argument multiple times (once for --body and multiple times for --attach).  In this case, the same content will be attached each time it is specified.  This is useful for attaching the same content with multiple MIME types.

=item --attach-type [mime-type]

By default, content that gets MIME attached to a message with the --attach option is encoded as application/octet-stream.  --attach-type changes the mime type for every --attach option which follows it.  It can be specified multiple times.

=item --attach-name [name]

This option sets the filename that will be included in the MIME part created for the next --attach option.  If no argument is set for this option, it causes no filename information to be included for the next MIME part, even if swaks could generate it from the local file name.

=item -ah, --add-header [header]

This option allows headers to be added to the DATA.  If %H is present in the DATA it is replaced with the argument to this option.  If %H is not present, the argument is inserted between the first two consecutive newlines in the DATA (that is, it is inserted at the end of the existing headers).

The option can either be specified multiple times or a single time with multiple headers separated by a literal '\n' string.  So, "--add-header 'Foo: bar' --add-header 'Baz: foo'" and "--add-header 'Foo: bar\nBaz: foo'" end up adding the same two headers.

=item --header [header-and-data], --h-Header [data]

These options allow a way to change headers that already exist in the DATA.  '--header "Subject: foo"' and '--h-Subject foo' are equivalent.  If the header does not already exist in the data then this argument behaves identically to --add-header.  However, if the header already exists it is replaced with the one specified.

=item -g

If specified, swaks will read the DATA value for the mail from STDIN.  This is equivalent to "--data -".  If there is a From_ line in the email, it will be removed (but see -nsf option).  Useful for delivering real message (stored in files) instead of using example messages.

=item --no-data-fixup, -ndf

This option forces swaks to do no massaging of the DATA portion of the email.  This includes token replacement, From_ stripping, trailing-dot addition, --body/attachment inclusion, and any header additions.  This option is really only useful when used with --data, since the internal default DATA portion uses tokens.

=item --no-strip-from, -nsf

Don't strip the From_ line from the DATA portion, if present.

=back

=head1 OUTPUT OPTIONS

By default swaks provides a transcript of its transactions to its caller (STDOUT/STDERR).  This transcript aims to be as faithful a representation as possible of the transaction though it does modify this output by adding informational prefixes to lines and by providing plaintext versions of TLS transactions

The "informational prefixes" are referred to as transaction hints.  These hints are initially composed of those marking lines that are output of swaks itself, either informational or error messages, and those that indicate a line of data actually sent or received in a transaction.  This table indicates the hints and their meanings:

=over 4

=item ===

Indicates an informational line generated by swaks

=item ***

Indicates an error generated within swaks

=item ->

Indicates an expected line sent by swaks to target server

=item ~>

Indicates a TLS-encrypted, expected line sent by swaks to target server

=item **>

Indicates an unexpected line sent by swaks to the target server

=item *~>

Indicates a TLS-encrypted, unexpected line sent by swaks to target server

=item >

Indicates a raw chunk of test sent by swaks to a target server (see --show-raw-text).  There is no concept of "expected" or "unexpected" at this level.

=item <-

Indicates an expected line sent by target server to swaks

=item <~

Indicates a TLS-encrypted, expected line sent by target server to swaks

=item <**

Indicates an unexpected line sent by target server to swaks

=item <~*

Indicates a TLS-encrypted, unexpected line sent by target server to swaks

=item <

Indicates a raw chunk of text received by swaks from a target server (see --show-raw-text).  There is no concept of "expected" or "unexpected" at this level.

=back

The following options control what and how output is displayed to the caller.

=over 4

=item -n, --suppress-data

Summarizes the DATA portion of the SMTP transaction instead of printing every line.  This option is very helpful, bordering on required, when using swaks to send certain test emails.  Emails with attachments, for instance, will quickly overwhelm a terminal if the DATA is not supressed.

=item -stl, --show-time-lapse [i]

Display time lapse between send/receive pairs.  This option is most useful when Time::HiRes is available, in which case the time lapse will be displayed in thousandths of a second.  If Time::HiRes is unavailable or "i" is given as an argument the lapse will be displayed in integer seconds only.

=item -nih, --no-info-hints

Don't display the transaction hint for informational transactions.  This is most useful when needing to copy some portiong of the informational lines, for instance the certificate output from --tls-get-peer-cert.

=item -nsh, --no-send-hints

=item -nrh, --no-receive-hints

=item -nth, --no-hints

--no-send-hints and --no-receive-hints supress the transaction prefix from send and receive lines, respectively.  This is often useful when copying some portion of the transaction for use elsewhere (for instance, "--no-send-hints --hide-receive --hide-informational" is a useful way to get only the client-side commands for a given transaction).  --no-hints is identical to specifying both --no-send-hints and --no-receive-hints.

Don't show transaction hints (useful in conjunction with -hr to create copy/paste-able transactions).

=item -raw, --show-raw-text

This option will print a hex dump of raw data sent and received by swaks.  Each hex dump is the contents of a single read or write on the network.  This should be identical to what is already being displayed (with the exception of the \r characters being removed).  This option is useful in seeing details when servers are sending lots of data in single packets, or breaking up individual lines into multiple packets.  If you really need to go in depth in that area you're probably better with a packet sniffer, but this option is a good first step to seeing odd connection issues.

=item --output-file </path/to/file>

=item --output-file-stdout </path/to/file>

=item --output-file-stderr </path/to/file>

These options allow the user to send output to files instead of stdout/stderr.  The first option sends both to the same file.  The arguments of &STDOUT and &STDERR are treated specially, refering to the "normal" file handles, so "--output-file-stderr '&STDOUT'" would redirect STDERR to STDOUT.

=item -pp, --protect-prompt

Don't echo user input on prompts that are potentially sensitive (right now only authentication password).  See also --auth-hide-password

=item -hr, --hide-receive

Don't display lines sent from the remote server being received by swaks

=item -hs, --hide-send

Don't display lines being sent by swaks to the remote server

=item -hi, --hide-informational

Don't display non-error informational lines from swaks itself.

=item -ha, --hide-all

Do not display any content to the terminal.

=item -S, --silent [level]

Cause swaks to be silent.  If no argument is given or if an argument of "1" is given, print no output unless/until an error occurs, after which all output is shown.  If an argument of "2" is given, only print errors.  If "3" is given, show no output ever.

=item --support

Print capabilities and exit.  Certain features require non-standard perl modules.  This options evaluates whether these modules are present and displays which functionality is available and which isn't, and which modules would need to be added to gain the missing functionality.

=item --dump

This option causes swaks to print the results of option processing, immediately before mail would have been sent.  No mail will be sent when --dump is used.  Note that --dump is considered to be a pure self-diagnosis tool and no effort is made or will ever be made to mask passwords in the --dump output.

=item --help

Display this help information.

=item --version

Display version information.

=back

=head1 PORTABILITY

=over 4

=item OPERATING SYSTEMS

This program was primarily intended for use on unix-like operating systems, and it should work on any reasonable version thereof.  It has been developed and tested on Solaris, Linux, and Mac OS X and is feature complete on all of these.

This program is known to demonstrate basic functionality on Windows using ActiveState's Perl.  It has not been fully tested.  Known to work are basic SMTP functionality and the LOGIN, PLAIN, and CRAM-MD5 auth types.  Unknown is any TLS functionality and the NTLM/SPA and DIGEST-MD5 auth types.

Because this program should work anywhere Perl works, I would appreciate knowing about any new operating systems you've thoroughly used swaks on as well as any problems encountered on a new OS.

=item MAIL SERVERS

This program was almost exclusively developed against Exim mail servers.  It was been used casually by the author, though not thoroughly tested, with Sendmail, Smail, Exchange, Oracle Collaboration Suite, qpsmtpd, and Communigate.  Because all functionality in swaks is based off of known standards it should work with any fairly modern mail server.  If a problem is found, please alert the author at the address below.

=back

=head1 EXIT CODES

=over 4

=item 0

no errors occurred

=item 1

error parsing command line options

=item 2

error connecting to remote server

=item 3

unknown connection type

=item 4

while running with connection type of "pipe", fatal problem writing to or reading from the child process

=item 5

while running with connection type of "pipe", child process died unexpectedly.  This can mean that the program specified with --pipe doesn't exist.

=item 6

Connection closed unexpectedly.  If the close is detected in response to the 'QUIT' swaks sends following an unexpected response, the error code for that unexpected response is used instead.  For instance, if a mail server returns a 550 response to a MAIL FROM: and then immediately closes the connection, swaks detects that the connection is closed, but uses the more specific exit code 23 to detail the nature of the failure.  If instead the server return a 250 code and then immediately closes the connection, swaks will use the exit code 6 because there is not a more specific exit code.

=item 10

error in prerequisites (needed module not available)

=item 21

error reading initial banner from server

=item 22

error in HELO transaction

=item 23

error in MAIL transaction

=item 24

no RCPTs accepted

=item 25

server returned error to DATA request

=item 26

server did not accept mail following data

=item 27

server returned error after normal-session quit request

=item 28

error in AUTH transaction

=item 29

error in TLS transaction

=item 32

error in EHLO following TLS negotiation

=item 33

error in XCLIENT transaction

=item 34

error in EHLO following XCLIENT

=back

=head1 ABOUT THE NAME

The name "swaks" is a (sort-of) acronym for "SWiss Army Knife Smtp".  It was chosen to be fairly distinct and pronounceable.  While "swaks" is unique as the name of a software package, it has some other, non-software meanings.  Please send in other uses of "swak" or "swaks" for inclusion.

=over 4

=item "Sealed With A Kiss"

SWAK/SWAKs turns up occasionally on the internet with the meaning "with love".

=item bad / poor / ill (Afrikaans)

Seen it in the headline "SA se bes en swaks gekledes in 2011", which was translated as "best and worst dressed" by native speakers.  Google Translate doesn't like "swaks gekledes", but it will translate "swak" as "poor" and "swak geklede" as "ill-dressed".

=back

=head1 CONTACT

=over 4

=item proj-swaks@jetmore.net

Please use this address for general contact, questions, patches, requests, etc.

=item updates-swaks@jetmore.net

If you would like to be put on a list to receive notifications when a new version of swaks is released, please send an email to this address.

=item http://www.jetmore.org/john/code/swaks/

Change logs, this help, and the latest version is found at this link.

=back

=cut
__END__
