<template>
  <v-container class="pa-10" fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card style="border-radius:15px;">
          <v-img
            class="white--text"
            height="120px"
            src="https://cdn.pixabay.com/photo/2018/01/11/04/27/darkness-3075379__340.jpg"
            style="border-radius:10px;"
          >
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs6 align-end flexbox>
                  <span class="headline">{{$t('review.boardTitle')}}</span>
                </v-flex>
                <!-- <v-flex xs6 align-end flexbox>
                  <span>{{board.rmk}}</span>
                </v-flex> -->
              </v-layout>
            </v-container>
          </v-img>
        </v-card>
      </v-flex>
      <v-col cols="12"> 
        <v-text-field
          dark
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('board.search')"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
      <v-row >
        <v-col cols="8" offset="2">
          <v-row>
            <v-card
              v-for="movie in movies"
              :key="movie._id"
              :loading="loading"
              class="mx-auto ma-10"
              max-width="200"
              max-height="285"
              id="togetherCard"
              @click="detailPage(movie)"
            >
              <v-img
                class="white--text align-end"
                height="285"
                :src="movie.img"
              >
              </v-img>
              <v-card-subtitle class="white--text rateMovie">
                {{movie.title_kr}}&emsp;{{movie.tomato}}
              </v-card-subtitle>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-layout>
    <div class="text-xs-center pt-2">
          <v-pagination v-model="curPageNum" :length="numOfPages"></v-pagination>
    </div>
    <!--progress circular -->
    <v-progress-circular
      v-if="progressCircular"
      :size="70"
      :width="7"
      color="blue"
      center
      indeterminate
    ></v-progress-circular>

    <v-dialog
      v-model="dialog"
      width="800px"
    >
      <v-card v-if="toggle">
        <v-img
          :src="detailPageInfo.img"
        >
        </v-img>
        <v-card-title>
          <span class="text-h5">
            {{$t('review.movieInfo')}}
          </span>
        </v-card-title>
        <v-card-text>
          {{detailPageInfo.title_kr}}</br>
          {{detailPageInfo.title_en}}</br>
          개봉일: {{detailPageInfo.release}}</br>
          감독: {{detailPageInfo.director}}</br>
          출연: {{detailPageInfo.actor}}</br>
          장르: {{detailPageInfo.genre}}</br>      
          줄거리: {{detailPageInfo.synopsis}}</br>
          AAC Rate : {{ avgRate || ""}}
          <!-- rate, img  -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="yellow darken-1"
            text
            @click="dialogRate = true"
          >
            <v-icon>mdi-ticket</v-icon>
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>

        <v-divider></v-divider>
        <v-list two-line v-for="comment in detailPageInfo._comments" :key="comment._id">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{comment.content}}</v-list-item-title>
              <v-list-item-subtitle>{{comment._user.name}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                  icon
                  ripple
                  @click="commentDialogOpen(comment)"
              >
                <v-icon right color="warning lighten-1">
                  mdi-keyboard-return
                </v-icon>
              </v-btn>

            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                  icon
                  ripple
                  @click="delComment(comment)">
                <v-icon right color="error">
                  mdi-eraser
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
        </v-list>
        <v-card-text>
          <v-text-field
              :label="$t('review.writeComments')"
              v-model="formComment.content"
              append-icon="mdi-send"
              @keyup.enter="addComment"
              @click:append="addComment"
          >
          </v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- 댓글 -->
    <v-dialog width="400" v-model="commentDialog">
      <v-card>
        <v-card-text>
          <v-card-title>
            <span class="headline">{{$t('review.editComment')}}</span>
          </v-card-title>
          <v-text-field
              label="Edit Comments"
              v-model="selComment.content"
              @keyup.enter="modComment()"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="warning" @click="modComment()">
            {{$t('review.edit')}}
          </v-btn>
          <v-btn color="secondary" @click="commentDialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>
    <!-- 별점 dialog -->
    <v-dialog width="600" v-model="dialogRate">
      <v-card>
        <v-card-title class= "text-h5">
          {{$t('review.rateMovie')}}
        </v-card-title>
        <v-card-text>
          <div class= "text-center mt-12">
            <v-rating
              v-model="rating"
              color = "yellow"
              background-color="grey darken-1"
              empty-icon = "$ratingFull"
              half-increments
              hover
              large
            ></v-rating>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-space-between">
          <v-btn text
            @click="dialogRate = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-btn text
            @click = "Rating"
          >
            {{$t('nav.submit')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </v-container>
</template>


<script>
import axios from 'axios'
export default {
  data () {
    return {
      board: {
        name: 'Loading...',
        rmk: ''
      },
      movies: [],
      curPageNum:1,
      dataPerPage:10,
      search:'',
      dataTotal: 0,
      pagination: {},
      progressCircular:false,
      dialog: false,
      detailPageInfo: {
        _comments: []
      },
      commentDialog: false,
      selComment: {
        content: ''
      },
      formComment: {
        content: '',
      },
      toggle: false,

      rating: 0,
      dialogRate: false,
    }
  },
  watch: {
    curPageNum: {
      handler() {
        this.list()
      },
      deep: true
    },
    'search': {
      handler() {
        this.delay()
      }
    },
  },
  computed:{
    // 페이지값 
    startOffset() {
        return ((this.curPageNum - 1) * this.dataPerPage);
      },
    // 페이지 length 값 쓰기위해 총데이터/페이지값 세팅
    numOfPages() {
      return Math.ceil(this.dataTotal / this.dataPerPage);
    },
    avgRate () {
      let sumRate = 0
      for (let i = 0; i < this.detailPageInfo.rate.length; i++) {
        sumRate += parseFloat(this.detailPageInfo.rate[i])
      }
      let avgRateFixed = (sumRate / this.detailPageInfo.rate.length).toFixed(2)
      return avgRateFixed
    }
  },
  mounted () {
    this.get()
    let lang = localStorage.getItem('language')
              if (lang == "日本語"){
                  this.$i18n.locale="日本語"
              } else if (lang == "English"){
                  this.$i18n.locale="English"
              } else {
                  this.$i18n.locale="한국어"
              }

  },
  methods:{
    // board get 
    get () {
      axios.get('/api/board/review')
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.board = data.d
          this.list()
        })
        .catch((e) => {
          this.$store.commit('pop', { msg: e.message, color: 'error' })
        })  
    },
    //movie list 받아오기
    list () {
      this.progressCircular = true
      axios.get(`/api/movie/list/review`,
        {params:{search:this.search, skip:this.startOffset, limit: this.dataPerPage}})
        // params skip, limit 보내기 (url)
        .then(({ data }) => {
          this.progressCircular = false

          if (!data.success) throw new Error(data.msg)
          this.movies = data.ds
          // dataTotal 값 갱신
          this.dataTotal = data.t
          
          // console.log('아티클확인',this.articles)
        })
        .catch((e) => {
          this.$store.commit('pop', { msg: e.message, color: 'error' })
        })
    },
    delay () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.list()
      }, 1000)
    },
    // 상세 페이지
    detailPage (atc) {
      this.detailPageInfo = atc
      // 
      this.toggle = !this.toggle
      this.loading = true
      axios.get(`/api/movie/read/${atc._id}`)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.dialog = true
          this.detailPageInfo.title_kr = data.d.title_kr
          this.detailPageInfo.title_en = data.d.title_en
          this.detailPageInfo.genre = data.d.genre
          this.detailPageInfo.release = data.d.release
          this.detailPageInfo.img = data.d.img
          this.detailPageInfo.tomato = data.d.tomato
          this.detailPageInfo.director = data.d.director
          this.detailPageInfo.actor = data.d.actor
          this.detailPageInfo.synopsis = data.d.synopsis
          this.detailPageInfo.rate= data.d.rate
          this.detailPageInfo._comments = data.d._comments
          this.toggle = true
          this.loading = false
        })
        .catch((e) => {
          this.$store.commit('pop', { msg: e.message, color: 'error' })
          this.loading = false
        })      
    },
    commentDialogOpen (c) {
      this.commentDialog = true
      this.selComment = c
    },
    addComment () {
      axios.post(`/api/mvcomment/${this.detailPageInfo._id}`, this.formComment)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.formComment.content = ''
          this.detailPage(this.detailPageInfo)
          // this.list()
        })
        .catch((e) => {
          this.$store.commit('pop', { msg: e.message, color: 'error' })
        })
    },
    delComment (cmt) {
      axios.delete(`/api/mvcomment/${cmt._id}`)
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.$store.commit('pop', { msg: this.$t('boardJS.successDelete'), color: 'success' })
          this.detailPage(this.detailPageInfo)
        })
        .catch((e) => {
          this.$store.commit('pop', { msg: e.message, color: 'error' })
        })
    },
    modComment () {
      if (!this.selComment.content) return this.$store.commit('pop', { msg: this.$t('boardJS.writeContents'), color: 'error' })
      this.commentDialog = false
      axios.put(`/api/mvcomment/${this.detailPageInfo._id}`, { content: this.selComment.content })
        .then(({ data }) => {
          if (!data.success) throw new Error(data.msg)
          this.$store.commit('pop', { msg: this.$t('boardJS.successEdit'), color: 'success' })
          this.detailPage(this.detailPageInfo)
        })
        .catch((e) => {
          this.$store.commit('pop', { msg: e.message, color: 'error' })
        })
    },
    Rating() {
      axios.put(`/api/movie/read/${this.detailPageInfo._id}/rating`, {rating:this.rating})
        .then((r) => {
          console.log(r)
          this.dialogRate = false
          this.$store.commit('pop', { msg: this.$t('boardJS.successRate'), color: 'success' })
        })
        .catch((e) => {
          this.dialogRate = false
          this.$store.commit('pop', { msg: e.message, color: 'error' })
        })
    },
  },

}
</script>
