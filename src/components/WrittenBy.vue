<template>
  <p
    v-if="isNotEmpty"
    :class="{
      'coral-Detail': true,
      'coral-Detail--XL': size == 'XL',
      'coral-Detail--L': size == 'L',
      'coral-Detail--M': size == 'M',
      'coral-Detail--S': size == 'S',
      'text-details': true
    }">
    <span v-if="showDate">
      {{getDate(article.publishedAt)}}
    </span>

    <span v-if="article.by">
      <span v-if="showDate" class="p-l-4"> • </span>
      <span class="p-l-4" >
        by
        <span
          class="p-r-4"
          v-for="user in article.by.data"
          :key="user.id"
        >

          <a v-if="user.attributes.url" :href="user.attributes.url">
            {{user.attributes.username}}
          </a>

          <span v-else>
            {{user.attributes.username}}
          </span>

          {{isSingleAuthor(user.id)}}
        </span>
      </span>

    </span>
  </p>
</template>

<script>

export default {
    name:"WrittenBy",

    props:{
      article: Object,
      showDate: Boolean,
      size: String
    },

    data(){
      return{}
    },
    
  methods:{
    isSingleAuthor(id){
      let tutorial = this.article.by.data

      let pos = tutorial.map(e => {
        return e.id;
      }).indexOf(id);
      
      if(tutorial[pos + 1] == undefined){
        return ''
      } else {
        return ' &'
      }
    },
    
    getDate(dateString){
      // var date = dateString;
      let date = new Date(dateString);
      var monthDate = date.getDate();
      var year = date.getUTCFullYear();

      let weekDay = date.getUTCDay()
      switch (weekDay) {
        case 0:
          weekDay = "Monday"
          break;
        case 1:
          weekDay = "Tuesday"
          break;
        case 2:
          weekDay = "Wendesday"
          break;
        case 3:
          weekDay = "Thursday"
          break;
        case 4:
          weekDay = "Friday"
          break;
        case 5:
          weekDay = "Saturday"
          break;
        case 6:
          weekDay = "Sunday"
          break;
          
        default:
          break;
      }
      
      let month = date.getUTCMonth();
      switch (month) {
        case 0:
          month = "Jan"
          break;
        case 1:
          month = "Feb"
          break;
        case 2:
          month = "March"
          break;
        case 3:
          month = "Apr"
          break;
        case 4:
          month = "May"
          break;
        case 5:
          month = "Jun"
          break;
        case 6:
          month = "Jul"
          break;
        case 7:
          month = "Aug"
          break;
        case 8:
          month = "Sep"
          break;
        case 9:
          month = "Oct"
          break;
        case 10:
          month = "Nov"
          break;
        case 11:
          month = "Dec"
          break;
          
        default:
          break;
      }
      // var date = new Date(dateString);
      return month + " " + monthDate + ', ' + year
    },

  },

  computed:{
    isNotEmpty(){
      try {
        return this.article.by.data.length > 0
      } catch (error) {
        return false
      }
    }
  },
}
</script>

<style>
</style>