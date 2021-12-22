<template>
    <div :label="icon.appName.replaceAll('_', ' ') + 'Icon'" class="card-wrapper card-hover coral-card m-0">
        
        <SaveIconsDialogue/>

        <div class="m-auto">
            
            <div
                :id="'saveIcon_'+icon.id"
                @click="saveIcon()"
                :class="{
                    'opacity-0': !isSaved,
                    'icon-heart': !isSaved,
                    'icon-heart-filled': isSaved,
                    'save-icon': true,
                }"
            > </div>

            <!-- Icon image -->
            <div class="card-img-wrapper" style="max-width: 120px;">
                
                <!-- macOS icon download -->
                <a
                    v-if="true"
                    rel="noopener"
                    :href="iconDownloadUrl"
                    @click="addClickCount(icon)"
                    target="_blank"
                >

                    <v-lazy-image
                        :src-placeholder="coralIcons.loading"
                        :alt="icon.appName +' icon'"
                        :src="iconUrl(icon)"
                    />
                </a>

            </div>

            <!-- Icon meta -->
            <div label="Icon info" class="card-text-wrapper p-l-16 p-r-16">

                <!-- App name -->
                <h3 class="coral-font-color m-0">
                    <span>
                        {{icon.appName.replaceAll("_", " ")}}
                    </span>
                </h3>
                
                <!-- Credit -->
                <p class="coral-Body--XS opacity-70 m-b-4 p-t-4">
                    <router-link :to="'/u/'+icon.usersName" class="coral-Link">{{icon.usersName}}</router-link>
                    on
                    <span class="coral-Body--XS">
                        {{ getDate(icon.timeStamp) }}
                    </span>
                </p>
                
                <!-- <div v-if="isOwner" class="p-t-8 p-b-4">
                    <button @click="showDialog('editIconDialog')" is="coral-button" variant="outline">Edit</button>
                </div> -->

            </div>

        </div>
        <!-- Download Counter -->
        <div label="Download Counter" class="download-counter-wrapper opacity-70">
            <p v-if="icon.downloads > 1" class="coral-Body--XS m-0 d-inline">
                {{icon.downloads}}
            </p>

            <p v-else class="coral-Body--XS m-0 d-inline">
                0
            </p>

            <img height="10px" :src="coralIcons.download" alt="Download counter">
        </div>
    </div>  
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Parse from 'parse/dist/parse.min.js';;

import deleteDialog from './deleteDialog.vue';
import SaveIconsDialogue from './SaveIconsDialogue.vue';
import EditIconDialog from "./EditIconDialog.vue"
import VLazyImage from "v-lazy-image";

var Icons = Parse.Object.extend("Icons2");

import downloadIcon from "../assets/icons/Download.svg"
import addCoralIcon from "../assets/icons/add.svg"
import newItemCoralIcon from "../assets/icons/newItem.svg"
import editCoralIcon from "../assets/icons/edit.svg"
import placeholderCoralIcon from "../assets/placeholder-icon.png"
import heartIcon from "../assets/icons/Category_Icons/Heart.svg"
import deleteIcon from "../assets/icons/delete.svg"

export default {
    name: "UserIconCard",
    
    props:{
        icon:{},
        isAdmin: false,
        isOwner: false,
        isMacOs: Boolean,
    },

    components: {
        EditIconDialog,
        deleteDialog,
        SaveIconsDialogue,
        VLazyImage
    },

    data(){
        return{
            coralIcons:{
                download: downloadIcon,
                delete: deleteIcon,
                addIcon: addCoralIcon,
                newItem: newItemCoralIcon,
                edit: editCoralIcon,
                loading: placeholderCoralIcon,
            },
            icons:{
                Heart: heartIcon
            },
            dialog:{
                editIcon: false,
                deleteIcon: false
            },
            isSaved: false
        }
    },
    
    mounted(){
        this.isSaved = this.icon.isSaved;
    },

    methods:{
        ...mapActions(['showEl', 'setSelectedIcon', 'addClickCount']),

        prettifyName(name){
            console.log("name: ", name);
            name = name.replaceAll("_", " ")
            return name
        },

        iconUrl(icon){
            if (!icon.lowResPngUrl) {
                return icon.highResPngUrl
            } else{
                return icon.lowResPngUrl
            }
        },

        showDialog(id){
            let parent = this
            parent.setSelectedIcon(parent.icon)
            parent.showEl(id)
        },
        
        getDate(timeStamp){
            let newDate = new Date(timeStamp)
            let date
            
            let day = newDate.getUTCDate()
                if (day < 10) {
                day = "0"+day
                }
            let month = newDate.getUTCMonth() + 1
                if (month < 10) {
                month = "0"+month
                }
            let year = newDate.getFullYear()

            if(this.getUserAttributes.usaDateFormat){
                 date = month + "/" + day + "/" + year
                return date
            }

            date = day + "/" + month + "/" + year
            return date
        },

        async editDoc(icon, e, field){
            let newName = e.target.value
            
            let id
            if (icon.algoliaID == undefined) {
                id = icon.id
            } else {
                id = icon.algoliaID
            }

            console.log(icon);
            console.log(id);

            const IconsBase = Parse.Object.extend("Icons2");
            const query = new Parse.Query(IconsBase);
            const docToEdit = await query.get(id)

            docToEdit.set({ [field]: newName }) // Save icnsToStore obj with .icns file and its url to Parse server
            docToEdit.save().then(() =>{
                console.log(field, "updated.");
            }).catch((e) =>{
                document.getElementById("error").show()
            })
        },

        async saveIcon(){
            let parent = this
            
            if(!Parse.User.current()){
                this.showDialog('SaveIconsDialogue')
                return
            }

            let icon = parent.icon
            var Icons = Parse.Object.extend("Icons2");
            let iconQuery = new Parse.Query(Icons);

            icon = await iconQuery.get(icon.id)
            let userRelation = Parse.User.current().relation("favIcons")

            // const Confetti=(()=>{"use strict";const e=10;let t,o,n=75,i=25,r=1,s=!1,l=!0,a=[],d=(new Date).getTime();function p(e){if(t=document.createElement("canvas"),o=t.getContext("2d"),t.width=2*window.innerWidth,t.height=2*window.innerHeight,t.style.position="fixed",t.style.top=0,t.style.left=0,t.style.width="calc(100%)",t.style.height="calc(100%)",t.style.margin=0,t.style.padding=0,t.style.zIndex=999999999,t.style.pointerEvents="none",document.body.appendChild(t),null!=e){let t=document.getElementById(e);null!=t&&t.addEventListener("click",e=>{!function(e,t){let o=[];for(let i=0;i<n;i++)o.push(c(e,t));a.push({particles:o})}(2*e.clientX,2*e.clientY),l&&(e.target.style.visibility="hidden")})}window.addEventListener("resize",()=>{t.width=2*window.innerWidth,t.height=2*window.innerHeight})}function y(e){return e.pos.y-2*e.size.x>2*window.innerHeight}function c(e,t){let o=(16*Math.random()+4)*r,n=(4*Math.random()+4)*r;return{pos:{x:e-o/2,y:t-n/2},vel:h(),size:{x:o,y:n},rotation:360*Math.random(),rotation_speed:10*(Math.random()-.5),hue:360*Math.random(),opacity:100,lifetime:Math.random()+.25}}function h(){let e=Math.random()-.5,t=Math.random()-.7,o=Math.sqrt(e*e+t*t);return t/=o,{x:(e/=o)*(Math.random()*i),y:t*(Math.random()*i)}}return p.prototype.setCount=(e=>{"number"==typeof e?n=e:console.error("[ERROR] Confetti.setCount() - Input needs to be of type 'number'")}),p.prototype.setPower=(e=>{"number"==typeof e?i=e:console.error("[ERROR] Confetti.setPower() - Input needs to be of type 'number'")}),p.prototype.setSize=(e=>{"number"==typeof e?r=e:console.error("[ERROR] Confetti.setSize() - Input needs to be of type 'number'")}),p.prototype.setFade=(e=>{"boolean"==typeof e?s=e:console.error("[ERROR] Confetti.setFade() - Input needs to be of type 'boolean'")}),p.prototype.destroyTarget=(e=>{"boolean"==typeof e?l=e:console.error("[ERROR] Confetti.destroyTarget() - Input needs to be of type 'boolean'")}),window.requestAnimationFrame(function t(n){let i=(n-d)/1e3;d=n;for(let t=a.length-1;t>=0;t--){let o=a[t];for(let t=o.particles.length-1;t>=0;t--){let n=o.particles[t];n.vel.y+=e*(n.size.y/(10*r))*i,n.vel.x+=25*(Math.random()-.5)*i,n.vel.x*=.98,n.vel.y*=.98,n.pos.x+=n.vel.x,n.pos.y+=n.vel.y,n.rotation+=n.rotation_speed,s&&(n.opacity-=n.lifetime),y(n)&&o.particles.splice(t,1)}0==o.particles.length&&a.splice(t,1)}!function(){o.clearRect(0,0,2*window.innerWidth,2*window.innerHeight);for(const d of a)for(const a of d.particles)e=a.pos.x,t=a.pos.y,n=a.size.x,i=a.size.y,r=a.rotation,s=a.hue,l=a.opacity,o.save(),o.beginPath(),o.translate(e+n/2,t+i/2),o.rotate(r*Math.PI/180),o.rect(-n/2,-i/2,n,i),o.fillStyle=`hsla(${s}deg, 90%, 65%, ${l}%)`,o.fill(),o.restore();var e,t,n,i,r,s,l}(),window.requestAnimationFrame(t)}),p})();

            let confetti = new Confetti('saveIcon_'+parent.icon.id);
            confetti.setCount(25);
            confetti.setSize(1);
            confetti.setPower(7);
            confetti.setFade(true);
            confetti.destroyTarget(false);

            // If isSaved is true, remove from databse
            if (parent.isSaved) {
                userRelation.remove(icon)
            } else{
                userRelation.add(icon)
            }

            Parse.User.current().save().then((data) =>{
                parent.isSaved = !parent.isSaved
                console.log("SAVED!!!");
            }).catch((e) =>{
                console.log("ERROR: ", e);
            })
        },

    },

    computed:{
        ...mapGetters([
            'getUserAttributes',
        ]),

        iconDownloadUrl(){
            let icon = this.icon
            if (this.isMacOs) {
                return icon.icnsUrl
            } else{
                return icon.iOSUrl
            }
        },
    }
}
</script>

<style>

</style>