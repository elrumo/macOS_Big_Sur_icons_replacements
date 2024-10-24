<template>
  <coral-dialog id="iconDetailsDialog" class="icon-details-dialog">
    <coral-dialog-header>{{ icon.appName }}</coral-dialog-header>
    
    <coral-dialog-content>
      <div class="icon-details-content">
        <!-- Icon Image -->
        <div class="icon-preview">
          <img :src="icon.lowResPngUrl" :alt="icon.appName + ' icon'">
        </div>

        <!-- Icon Info -->
        <div class="icon-info">
          <div class="info-row">
            <span class="label">Uploaded by:</span>
            <a :href="icon.uploadedBy" class="coral-Link">{{ getUploaderName }}</a>
          </div>
          <div class="info-row">
            <span class="label">Downloads:</span>
            <span>{{ icon.downloads }}</span>
          </div>
          <div class="info-row">
            <span class="label">Upload date:</span>
            <span>{{ formatDate(icon.timeStamp) }}</span>
          </div>
          <div v-if="icon.credit" class="info-row">
            <span class="label">Credit:</span>
            <span>{{ icon.credit }}</span>
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

        <!-- Similar Icons -->
        <div v-if="similarIcons.length" class="similar-icons">
          <h3 class="coral-Heading--S">Similar Icons</h3>
          <div class="similar-icons-grid">
            <UserIconCard
              v-for="similarIcon in similarIcons"
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
import { mapActions } from 'vuex';
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
      similarIcons: []
    }
  },

  computed: {
    getUploaderName() {
      return this.icon.uploadedBy.split('/u/')[1];
    }
  },

  methods: {
    ...mapActions(['algoliaSearch']),

    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    },

    async downloadIcon() {
      window.open(this.icon.icnsUrl, '_blank');
      this.$emit('download', this.icon);
    },

    shareIcon() {
      const url = `${window.location.origin}${window.location.pathname}?icon=${this.icon.id}`;
      navigator.clipboard.writeText(url);
      this.$emit('share');
    },

    async fetchSimilarIcons() {
      try {
        const searchResults = await this.$store.dispatch('algoliaSearch', {
          search: this.icon.appName,
          searchOptions: {
            hitsPerPage: 4,
            filters: `NOT objectID:${this.icon.id}`
          }
        });
        this.similarIcons = searchResults.hits || [];
      } catch (error) {
        console.error('Error fetching similar icons:', error);
        this.similarIcons = [];
      }
    }
  },

  mounted() {
    this.fetchSimilarIcons();
  }
}
</script>

<style scoped>
.icon-details-dialog {
  max-width: 800px;
  display: none;
}

.icon-details-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.icon-preview {
  text-align: center;
}

.icon-preview img {
  max-width: 256px;
  height: auto;
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
  justify-content: center;
}

.similar-icons {
  margin-top: 24px;
}

.similar-icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
</style>
