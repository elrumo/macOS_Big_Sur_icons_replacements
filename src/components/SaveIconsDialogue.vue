<template>
    <coral-dialog id="SaveIconsDialogue">
      <coral-dialog-content>
      <div class="signin-dialog-content">    
        <div>
          <img style="width: 48px" :src="imgs.macOSiconsLogo" alt="">

          <div>
            <h3 class="coral-Heading--M m-t-8">
              Want to save an icon?
            </h3>
            <p class="coral-Body--M p-t-24" style="font-weight: lighter">
              To save an icon, you need to be have an account. Create an account to save icons, submit new ones and more!
             </p>
          </div>

        </div>
      </div>
      </coral-dialog-content>

      <coral-dialog-footer>
        <button is="coral-button" variant="quiet" coral-close>
          Close
        </button>

        <button is="coral-button" variant="cta" coral-close @click="showDialog('loginDialog')">
          Login or sign up
        </button>
      </coral-dialog-footer>
    </coral-dialog>
</template>

<script>
import Marked from 'marked';

import logoLowRes from "../assets/Resources/logo_lowres.png"

export default {
    name: "SaveIconsDialogue",
    
    props:{
        step:{},
    },

    data(){
        return{
            imgs:{
                macOSiconsLogo: logoLowRes
            },
        }
    },

    methods:{
        showDialog(dialog) {
            let dialogEl = document.getElementById(dialog);
            dialogEl.show();
        }
    },
    
    computed: {
    }
}
</script>

<style>

</style>