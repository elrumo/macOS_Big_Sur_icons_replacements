<template>
  <div>

    <section class="icon-list-area p-t-40 p-b-50">
      <div v-for="icon in userIcons" class="icon-card-wrapper user-icon-card card-wrapper coral-card" :key="icon.objectId">  
        <coral-status v-if="icon.approved" variant="success"/>
        <coral-status v-else variant="error"/>

        <div class="card-img-wrapper" style="max-width: 120px;">
          <a rel="noopener" :href="icon.highResPngUrl">
            <div v-lazy-container="{ selector: 'img', loading: coralIcons.loading }">
              <img :alt="icon.appName +' icon'" :data-src="icon.highResPngUrl">
            </div>
          </a>
          
          <div class="quick-actions-wrapper">
            <div class="quick-action-el">
              <coral-icon icon="/img/delete.4f641200.svg" role="presentation" title="Delete" class="quick-action-icon _coral-Icon _coral-Icon--sizeS" size="S">
                <img class="_coral-Icon _coral-Icon--image" src="/img/delete.4f641200.svg" alt="Delete">
              </coral-icon>
            </div>
          </div>
        </div>

        <form class="coral-FormGroup card-text-wrapper p-l-15 p-r-15 p-b-15">
          
          <div class="coral-FormGroup-item">
            <p class="coral-Body--XS"></p>
            <label :id="'icon-appName-label'+icon.objectId" class="coral-FieldLabel">
              AppName
            </label>
            <input
              :id="'icon-appName-field'+icon.objectId"
              is="coral-textfield"
              labelledby="icon-appName-label"
              class="coral-Form-field"
              type="text"
              v-on:change="validate($event, 'appName')"
              :value="icon.appName"
            >
          </div>

          <div class="coral-FormGroup-item">
            <p class="coral-Body--XS"></p>
            <label :id="'icon-appCategory-label'+icon.objectId" class="coral-FieldLabel">
              App category
            </label>
            <select
              :id="'icon-appCategory-field'+icon.objectId"
              labelledby="icon-appCategory-label"
              placeholder="Select category"
              class="dropdown-select"
              v-on:change="validate($event, 'category')"
            >
              <option
                v-for="category in getAppCategories"
                :key="category.CategoryName+icon.randId+Math.floor(Math.random() * 10000000 + 1)"
                :value="category.objectId"
                :selected="isSelected(icon.category, category.CategoryName)"
              >
                {{ category.CategoryName }}
              </option>
              <option
                value="-"
                :selected="isSelected(icon.category)"
              >
                -
              </option>
            </select>
          </div>

          <div class="coral-FormGroup-item">
            <p class="coral-Body--XS"></p>
            <label :id="'icon-appWebsite-label'+icon.objectId" class="coral-FieldLabel">
              App Website
            </label>
            <input
              :id="'icon-appWebsite-field'+icon.objectId"
              is="coral-textfield"
              labelledby="icon-appWebsite-label"
              class="coral-Form-field"
              type="text"
              v-on:change="validate($event, 'appWebsite')"
              :value="icon.appWebsite"
            >
          </div>

          <div class="coral-FormGroup-item">
            <p class="coral-Body--XS"></p>
            <label :id="'icon-iconDesigner-label'+icon.objectId" class="coral-FieldLabel">
              App Icon Designer
            </label>
            <input
              :id="'icon-iconDesigner-field'+icon.objectId"
              is="coral-textfield"
              labelledby="icon-iconDesigner-label"
              class="coral-Form-field"
              type="text"
              v-on:change="validate($event, 'iconDesigner')"
              :value="icon.iconDesigner"
            >
          </div>

        </form>
      </div>
    </section>  

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name:"UserIconGrid",

    props:{
      userIcons:'',
    },

    components:{},
    
    data(){
        return{
          coralIcons:{
            addIcon: require("../assets/icons/add.svg"),
            delete: require("../assets/icons/delete.svg"),
            newItem: require("../assets/icons/newItem.svg"),
            edit: require("../assets/icons/edit.svg"),
            loading: require("../assets/no-app-icon.png"),
          }
        }
    },
    
    mounted: function(){

    },

    methods:{
      isSelected(selected, option){
        try {
          if (selected.CategoryName == option) {
            return true;
          } else {
            return false;
          } 
        } catch (error) {
          return true;
        }
      },

      validate(e, field){
        let parent = this
        try {
          let isInvalid = e.target.classList.contains("is-invalid")

          if (isInvalid) { parent.isValidated = false }
          else{ parent.isValidated = true }

        }catch(error){ }
        parent.getTextFieldValue(e, field)
      },

      getTextFieldValue(e, field){
        let parent = this
        let fieldValue = e.target.value
        console.log(field, ": ", fieldValue);
        // parent.toUpdate[field] = fieldValue
      },
    },

    computed:{
      ...mapGetters(['getUser', 'getUserIcons', 'notApproved', 'getAppCategories']),

    }
}
</script>

<style>

</style>