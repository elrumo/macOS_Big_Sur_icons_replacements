<template>
  <!-- Delete Account confirmation -->
  <coral-dialog id="deleteAccountDialog">
    <coral-dialog-header>Delete Your Account</coral-dialog-header>
    
    <coral-dialog-content>
      <div class="delete-account-warning">
        <h4 class="coral-Heading--XS coral-Heading--light">⚠️ This action cannot be undone</h4>
        
        <p class="coral-Body--S">
          Deleting your account will permanently remove:
        </p>
        
        <ul class="coral-Body--S delete-account-list">
          <li>Your profile and all personal information</li>
          <li>All icons you have uploaded ({{ userIconsCount }} icons)</li>
          <li>Your saved icons collection</li>
          <li>All account settings and preferences</li>
        </ul>
        
        <p class="coral-Body--S delete-account-final-warning">
          <strong>This action is final and cannot be reversed.</strong>
        </p>
        
        <div class="">
          <label class="coral-FieldLabel">Type "DELETE" to confirm:</label>
          <input
            is="coral-textfield"
            v-model="confirmationText"
            v-on:keyup="updateConfirmationText($event)"
            v-on:change="updateConfirmationText($event)"
            placeholder="Type DELETE here"
            class="coral-Form-field"
            type="text"
          >
        </div>

        <div class="m-t-8">
          <label class="coral-FieldLabel">Your password:</label>
          <input
            is="coral-textfield"
            v-model="userPassword"
            v-on:keyup="updateUserPassword($event)"
            v-on:change="updateUserPassword($event)"
            placeholder="Password"
            class="coral-Form-field"
            type="password"
          >
        </div>
      </div>
    </coral-dialog-content>

    <coral-dialog-footer>
      <button is="coral-button" variant="quiet" coral-close="">Cancel</button>
      <button 
        is="coral-button" 
        variant="warning" 
        :disabled="(confirmationText !== 'DELETE' || isDeleting) || userPassword.length < 3"
        @click="deleteAccount"
      >
        {{ isDeleting ? 'Deleting...' : 'Delete Account' }}
      </button>
    </coral-dialog-footer>
  </coral-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "DeleteAccountDialog",
  
  data() {
    return {
      confirmationText: '',
      userPassword: '',
      isDeleting: false
    }
  },
  
  computed: {
    ...mapGetters(['getUser', 'approvedIconsCount']),
    
    userIconsCount() {
      return this.approvedIconsCount.approved + this.approvedIconsCount.notApproved || 0
    }
  },
  
  methods: {
    ...mapActions(['showToast', 'logOut', 'handleParseError', 'deleteUserAccount']),
    
    updateConfirmationText(event){
      this.confirmationText = event.target.value;
    },

    updateUserPassword(event){
      this.userPassword = event.target.value;
    },

    async deleteAccount() {
      if (this.confirmationText !== 'DELETE') {
        return;
      }
      
      this.isDeleting = true;
      
      try {
        // Call the store action to delete the account
        await this.deleteUserAccount(this.userPassword);
        return
        
        // Close the dialog
        document.getElementById('deleteAccountDialog').hide();
        document.getElementById('accountDialog').hide();
        
        // Show success message
        this.showToast({
          id: "toastMessage",
          message: "Your account has been successfully deleted.",
          variant: "success"
        });
        
        // Log out the user
        this.logOut();
        
      } catch (error) {
        console.error('Error deleting account:', error);
        this.handleParseError(error);
        
        this.showToast({
          id: "toastMessage",
          message: "Failed to delete account. Please try again or contact support.",
          variant: "error"
        });
      } finally {
        this.isDeleting = false;
        this.confirmationText = '';
      }
    }
  },
  
  watch: {
    // Reset confirmation text when dialog is opened
    '$route'() {
      this.confirmationText = '';
    }
  }
}
</script>

<style scoped>
.delete-account-warning {
  padding: 16px 0;
  margin-top: -2rem;
}

.delete-account-list {
  margin: 12px 0;
  padding-left: 20px;
}

.delete-account-list li {
  margin-bottom: 8px;
}

.delete-account-final-warning {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 12px;
  margin: 16px 0;
  color: #991b1b;
}
</style>