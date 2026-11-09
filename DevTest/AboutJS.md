基礎結構:
==================================

const app = Vue.createApp({

  data() {

  },

  methods: {

  },

  computed: {

  },

  watch: {

  }

})
==================================

解釋說明
1. data()
放置需要追蹤（reactive）的狀態資料

更完整一點：
data()=定義畫面狀態(State)=Vue 會自動追蹤變化的資料

2. methods
事件定義區塊
✅ 基本正確

但不要只把它當成事件區。
更準確是：
methods=一般功能函式區
例如：
methods:
{
  SaveData(){},
  ResetData(){},
  CheckData(){},
  FormatPhone(){}
}

有些函式是按鈕觸發：<button @click="SaveData">

有些則是被其他函式呼叫：
SaveData(){
  this.CheckData();
}
所以：
methods ≠ 只有事件
methods = 所有一般功能函式

3. computed
我建議你記成：
多個資料
↓
自動計算
↓
得到一個結果

例如：
data(){
  return{

    firstName:'王',
    lastName:'小明'

  }
}
-----------
computed:{

  fullName(){

    return this.firstName + this.lastName;

  }

}
畫面：
{{ fullName }}

效果：
王
+
小明
↓
王小明

而且：
firstName 改變 或 lastName 改變 
會自動重新計算。

4. watch
監聽一個值變更
例如：
watch:
{
  status(newValue, oldValue)
  {
    console.log('狀態變更');
    }
}

當：this.status = 1;
變成：this.status = 0;
watch 被觸發

[computed 與 watch 差異]

computed目的：我要一個計算結果
例如：姓+名=全名

watch目的：我要知道它變了
例如：
使用者切換科別
↓
自動重新查詢醫師

5. methods:{} 空的可以嗎？
答案：✅ 完全可以

例如：
const app = Vue.createApp({
  data() {
    return {
      msg:'Hello'
    }
  },

  methods:{
  }
})



