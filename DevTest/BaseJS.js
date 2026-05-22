
Vue.createApp({

  data()
  { ///定義一個名稱為user的物件,其屬性有 uid、name....等
    //定義 Vue 需要追蹤（reactive）的狀態資-UI自動更新/Vue監控
    //-data 必須是一個 function
    //-function 必須 return 一個 object
    /*
    -Vue 規定的格式
    而且function 必須 return 一個 object
    data() //<<-data()為放置需要追蹤（reactive）的狀態資料
    {
      return {}
    }
     */

    return{

      // User Object
      user:{
        uid:'',
        name:'',
        sex:'',
        email:'',
        phone:'',
        address:'',
        status:'1'
      },

      errorMessage:'',
      successMessage:''

    }////return--結尾

  },////data()--結尾

  methods:{

    // 驗證資料
    CheckData(){

      this.errorMessage = ''
      this.successMessage = ''

      // UID
      if(!this.user.uid){

        this.ErrorAction('UID 必填')
        return
      }

      // Name
      if(!this.user.name){

        this.ErrorAction('姓名必填')
        return
      }

      // Email
      if(!this.user.email.includes('@')){

        this.ErrorAction('Email 格式錯誤')
        return
      }

      // Phone
      if(this.user.phone.length < 8){

        this.ErrorAction('電話長度不足')
        return
      }

      // 驗證成功
      this.SaveData()

    },////----checkData()-End

    // 儲存資料
    SaveData(){

      // 轉 JSON
      const jsonString =
        JSON.stringify(this.user)

      console.log(jsonString)

      this.successMessage =
        '資料儲存成功'

      // 模擬送後端
      console.log('送往後端 API')

    },////----SaveData()-End

    // 錯誤處理
    ErrorAction(msg){

      this.errorMessage = msg

      console.log('驗證失敗：' + msg)

    },

    // 重置資料
    ResetData(){

      this.user = {
        uid:'',
        name:'',
        sex:'',
        email:'',
        phone:'',
        address:'',
        status:'1'
      }

      this.errorMessage = ''
      this.successMessage = ''

    }, ///ResetData-end

AAA()
{
  console.log('AAA');

  },///AAA -END

BBB()
{
  alert('BBB');
},///BBB -END


} ////method--結尾

}).mount('#app')