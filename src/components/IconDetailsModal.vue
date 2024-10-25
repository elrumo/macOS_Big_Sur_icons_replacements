<template>
  <coral-dialog id="iconDetailsDialog" class="icon-details-dialog">
    <coral-dialog-header>
      Icon Details
      <button 
        @click="closeModal"
        is="coral-button" 
        class="close-button"
        variant="quiet"
        :icon="iconBrew('close18')"
      />
    </coral-dialog-header>

        
    <coral-dialog-content>
      <div class="ad-hero mobile-hidden">
          <NativeAd
            :varToWatch="getSelectedIcon"
            :template="1"
            adId="CWYDCK3J"
            zoneKey="CWYDCK3J"
            key="CWYDCK3J"
          />
        </div>
      <div class="icon-details-content">
        <div class="icon-details-header">
          <!-- Icon Image -->
          <div class="icon-preview">
            <img :src="getSelectedIcon.lowResPngUrl" :alt="getSelectedIcon.appName + ' icon'">
          </div>

          <div class="icon-details-right">
            <h2 class="info-row">
              {{ getSelectedIcon.appName }}
            </h2>
            <!-- Icon Info -->
            <div class="icon-info">
              <div class="info-row">
                <span class="label">Uploaded by</span>
                <a :href="getSelectedIcon.uploadedBy" class="coral-Link">{{ getUploaderName }}</a>
              </div>
              <div class="info-row">
                <span class="label">Downloads</span>
                <span>{{ getSelectedIcon.downloads || '0' }}</span>
                <span>{{ getSelectedIcon.id }}</span>
              </div>
              <div class="info-row">
                <span class="label">Upload date</span>
                <span>{{ formatDate(getSelectedIcon.timeStamp) }}</span>
              </div>
              <div v-if="icon.credit" class="info-row">
                <span class="label">Credit</span>
                <span>{{ getSelectedIcon.credit }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button @click="shareIcon" is="coral-button" variant="secondary">
                Share
              </button>
              <button @click="downloadIcon" is="coral-button" variant="cta">
                Download
              </button>
            </div>
          </div>
        </div>
        
        <!-- <div v-for="icon in getSimilarIcons">
          {{ icon }}
        </div> -->

        <!-- Similar Icons -->
        <div v-if="getSimilarIcons.length > 0 || getIsSimilarLoading" class="similar-icons">
        <!-- <div class="similar-icons"> -->
          <h3 class="coral-Heading--S">Similar Icons</h3>
          <div class="similar-icons-scroll">
            <UserIconCard
              v-for="similarIcon in getSimilarIcons.length > 0 ? getSimilarIcons : 5"
              :key="similarIcon.id"
              :icon="similarIcon"
              :isMacOs="true"
              :isLoading="getIsSimilarLoading"
            />
          </div>
        </div>
      </div>
    </coral-dialog-content>

  </coral-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UserIconCard from './UserIconCard.vue';
import iconBrew from '../api/iconBrew.js'
import NativeAd from "./NativeAd.vue";

export default {
  name: 'IconDetailsModal',
  
  components: {
    UserIconCard,
    NativeAd
  },

  props: {
    icon: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
    }
  },

  computed: {
    ...mapGetters([
        'getSelectedIcon',
        'getSimilarIcons',
        'getIsSimilarLoading',
      ]),

    getUploaderName() {
      try{
        return this.getSelectedIcon.uploadedBy.split('/u/')[1];
      } catch (error) {
        return this.getSelectedIcon.uploadedBy;
      }
    }
  },

  methods: {
    ...mapActions([
      'algoliaSearch',
      'addClickCount',
    ]),

    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    },

    iconBrew(iconName, filled = false) {
      let icon = iconBrew(iconName, filled);
      return icon
    },

    async downloadIcon() {
      window.open(this.getSelectedIcon.icnsUrl, '_blank');
      this.addClickCount(this.getSelectedIcon);
      // this.$emit('download', this.getSelectedIcon);
    },

    shareIcon() {
      const url = `${window.location.origin}${window.location.pathname}#/?icon=${this.getSelectedIcon.id}`;
      navigator.clipboard.writeText(url);
      this.$emit('share');
    },

    closeModal() {
      const modal = document.getElementById('iconDetailsDialog');
      if (modal) {
        modal.hide();
        this.clearIconFromUrl();
      }
    },

    handleModalClose() {
      this.clearIconFromUrl();
    },

    clearIconFromUrl() {
      // Remove icon parameter from URL while preserving other params
      const url = new URL(window.location.origin+'#/');
      window.history.replaceState({}, '', url);
    },
  },

  async mounted() {
    const urlParams = new URL(window.location.href.replace(/#/g, "%23")).searchParams;
    const iconParam = urlParams.get('icon');
    let parent = this;
  
    if (iconParam && Object.keys(this.getSelectedIcon).length == 0) {
      let icon = await this.algoliaSearch({
          similarSearch: false,
          setSelectedIcon: true,
          iconId: iconParam
      });

      this.algoliaSearch({
          search: icon.appName,
          similarSearch: true,
          category: icon.category
      });
    }

    let dialog = document.querySelector('#iconDetailsDialog');
    dialog.on('coral-overlay:close', function (event) {
      parent.clearIconFromUrl();
    });
  }
}
</script>

<style scoped lang="scss">
.icon-details-dialog {
  max-width: 800px;
  margin: 0 auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.icon-details-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  @media (max-width: 720px) {
      min-width: 720px;
      min-width: auto;
  }
}

.icon-details-header {
  display: flex;
  gap: 2rem;
  align-items: center;
  width: fit-content;

  @media (min-width: 801px) {
    padding-right: 1rem;
  }

  @media (max-width: 801px) {
    width: 100%;
    gap: 0rem;
    flex-direction: column;
    align-items: center;
  }
  
}

.icon-details-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  width: 300px;

  @media (max-width: 640px) {
    width: 100%;
    min-height: auto;
    justify-content: center;
    gap: 1rem;
  }
}

.icon-preview {
  flex-shrink: 0;
  max-width: fit-content;

  img {
    width: 256px;
    height: 256px;
    object-fit: contain;

    @media (max-width: 640px) {
      width: 200px;
      height: 200px;
    }
  }
}

.icon-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}

.info-row {
  display: flex;
  margin: 0px;
  flex-direction: column;
  max-width: 300px;
  
  @media (max-width: 820px) {
    text-align: center;
  }
}

.label {
  opacity: 0.8;
  font-size: 0.8rem;
}

.action-buttons {
  display: flex;
  margin-top: 0.75rem;
  gap: 1rem;

  button{
    width: 100%;
    margin: 0px;
  }

  @media screen and (max-width: 820px) {
    margin-top: 0.5rem;
    justify-content: center;
  }
}

.similar-icons {
  width: 100%;
}

.similar-icons-scroll {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 0.25rem;
  padding-bottom: 1rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.similar-icons-scroll::-webkit-scrollbar {
  height: 8px;
}

.similar-icons-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.similar-icons-scroll::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.similar-icons-scroll::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.similar-icons-scroll > * {
  flex: 0 0 200px;
}

.close-button {
  position: absolute;
  right: 0rem;
  width: fit-content;
  padding-left: 0px;
  padding-right: 0px;
  top: 50%;
  transform: translateY(-100%);
  min-width: 2.3rem;
}

.ad-hero{
  display: flex;
  justify-content: center;
  padding-bottom: 0.5rem;
  opacity: 0.8;
  transition: 0.2s;
  scale: 0.9;

  &:hover{
    opacity: 1;
    scale: 1;
  }
}

</style>