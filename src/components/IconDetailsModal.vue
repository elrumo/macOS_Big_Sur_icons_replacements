<template>
  <coral-dialog id="iconDetailsDialog" class="icon-details-dialog">
    <coral-dialog-header>
      {{ getSelectedIcon.appName }}
    </coral-dialog-header>

        
    <coral-dialog-content>
      <div class="icon-details-content">
        <div class="icon-details-header">
          <!-- Icon Image -->
          <div class="icon-preview">
            <img :src="getSelectedIcon.lowResPngUrl" :alt="getSelectedIcon.appName + ' icon'">
          </div>

          <div class="icon-details-right">
            <!-- Icon Info -->
            <div class="icon-info">
              <div class="info-row">
                <span class="label">Uploaded by:</span>
                <a :href="getSelectedIcon.uploadedBy" class="coral-Link">{{ getUploaderName }}</a>
              </div>
              <div class="info-row">
                <span class="label">Downloads:</span>
                <span>{{ getSelectedIcon.downloads }}</span>
              </div>
              <div class="info-row">
                <span class="label">Upload date:</span>
                <span>{{ formatDate(getSelectedIcon.timeStamp) }}</span>
              </div>
              <div v-if="icon.credit" class="info-row">
                <span class="label">Credit:</span>
                <span>{{ getSelectedIcon.credit }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button @click="downloadIcon" is="coral-button" variant="cta">
                Download
              </button>
              <button @click="shareIcon" is="coral-button" variant="secondary">
                Share
              </button>
            </div>
          </div>
        </div>

        <!-- Similar Icons -->
        <div v-if="getSimilarIcons.length" class="similar-icons">
          <h3 class="coral-Heading--S">Similar Icons</h3>
          <div class="similar-icons-scroll">
            <UserIconCard
              v-for="similarIcon in getSimilarIcons"
              :key="similarIcon.id"
              :icon="similarIcon"
              :isMacOs="true"
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

export default {
  name: 'IconDetailsModal',
  
  components: {
    UserIconCard
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
    ...mapActions(['algoliaSearch']),

    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    },

    async downloadIcon() {
      window.open(this.getSelectedIcon.icnsUrl, '_blank');
      this.$emit('download', this.getSelectedIcon);
    },

    shareIcon() {
      console.log("this.icon: ", this.getSelectedIcon);
      const url = `${window.location.origin}${window.location.pathname}?icon=${this.getSelectedIcon.id}`;
      navigator.clipboard.writeText(url);
      this.$emit('share');
    },
  },

  mounted() {
  }
}
</script>

<style scoped>
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
  gap: 1.5rem;
}

.icon-details-header {
  display: flex;
  gap: 2rem;
  align-items: center;
  width: fit-content;
  padding-right: 1rem;
}

.icon-details-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
}

.icon-preview {
  flex-shrink: 0;
  max-width: fit-content;
}

.icon-preview img {
  width: 256px;
  height: 256px;
  object-fit: contain;
}

.icon-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  gap: 8px;
}

.label {
  font-weight: bold;
  min-width: 100px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

@media (max-width: 640px) {
  .icon-details-header {
    flex-direction: column;
    align-items: center;
  }
  
  .icon-details-right {
    width: 100%;
    min-height: auto;
    justify-content: center;
    gap: 24px;
  }

  .action-buttons {
    margin-top: 24px;
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
</style>
