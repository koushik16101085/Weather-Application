// weatherStore.city // get;
// weather.city = 'csds';
const weatherStore = {
    privateCity: 'Pabna',
    privateCountry: 'BD',
    API_KEY:'4f5cad6b7fbbf32cb4d618481bf2aa1f',
  
    set city(name){
        console.log('city name');
       //validation;
       this.privateCity = name;
    },
    set country(name){
        console.log('country name');
       //validation;
       this.privateCountry = name;
    },
  async  fetchData(){
     try{
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${this.privateCity},${this.privateCountry}&units=meric&appid=${this.API_KEY}`
            )
            console.log(res.json)
            return await res.json();
             // const data = await res.json()
          //console.log(data);

     }catch(err) {
      UI.showMessage(err.message);
     }
      
        
    }
}
//weatherStore.city = 'csds';

const storage = {
  privateCity: '',
  privateCountry: '',
  set city (name){
      this.privateCity = name
  },
  set country (name){
       this.privateCountry = name
  },
  saveItem(){
    localStorage.setItem('BD-weather-city',this.privateCity);
    localStorage.setItem ('BD-weather-country',this.privateCountry);
  }
}


const UI = {
    // city: '',
    // country: '',
   loadSelectors(){
       const cityElm = document.querySelector('#city');
       const cityInfoElm = document.querySelector('#w-city');
       const iconElm = document.querySelector('#w-icon');
       const temperatureElm = document.querySelector('#w-temp');
       const pressureElm = document.querySelector('#w-pressure');
       const humidityElm = document.querySelector('#w-humidity');
       const feelElm = document.querySelector('#w-feel');
       const formElm = document.querySelector('#form');
       const countryElm = document.querySelector('#country');
       const messageElm = document.querySelector('#messageWrapper');

       return {
        
        cityInfoElm,
        cityElm,
        iconElm,
        temperatureElm,
        pressureElm,
         humidityElm,
        feelElm,
         formElm,
         countryElm,
         messageElm
       }
   },
   getInputValues(){
       const {cityElm, countryElm} = this.loadSelectors()
       const city = cityElm.value;
       //console.log(city);
       const country = countryElm.value
       return {
           city,
           country,
       }
     
   },
   validateInput(city, country){
       let error = false;
       if(city === '' || country === ''){
         error = true;
       }
       return error;
   },
   hideMessage(){
       const msgContentElm = document.querySelector('.err-msg');
     if(msgContentElm){
         setTimeout(()=>{
            msgElm.remove()
         },2000);

     }
   },
   showMessage(msg){
      const {messageElm} = this.loadSelectors();
      const elm = `<div class='alert alert-danger err-msg'>${msg}</div>`
      const msgContentElm = document.querySelector('.err-msg');
      if(!msgContentElm){
        messageElm.insertAdjacentHTML('afterbegin',elm);

      }
      this.hideMessage()
      
   },
   getIconSrc(iconCode){
     return 'https://openweathermap.org/img/w/' + iconCode + '.png';
   },
   printWeather(data){
       const {
           cityInfoElm,
           temperatureElm,
           pressureElm,
           humidityElm,
           feelElm,
           iconElm,
       } = this.loadSelectors();
       const {main, weather, name} = data;
       console.log(main);
     // console.log(data);
      cityInfoElm.textContent = name
      temperatureElm.textContent = `Temperature: ${main.temp}`
      pressureElm.textContent = `Pressure: ${main.pressure}kpa`
      humidityElm.textContent = `Humidity: ${main.humidity}kpa`
      feelElm.textContent = weather[0].description
      const src = this.getIconSrc (weather[0].icon)
      iconElm.setAttribute('src', src)
      console.log(src)
      //console.log(src);


   },
   resetInput(){
     const {countryElm, cityElm} = this.loadSelectors();
     cityElm.value = ''
     countryElm.value = ''
   },
   init(){
       const {formElm} = this.loadSelectors()
      // const that = this
       formElm.addEventListener ('submit', async (e) =>  {
           console.log(this);
           e.preventDefault();
           //console.log(e);
           // get input value
           const {city, country} = this.getInputValues()
           //const {city, country} = that.getInputValues();
           //reset input 
           this.resetInput();
           //validate input.
           const error = this.validateInput(city,country);
           //show error message to UI; 
           if(error)return this.showMessage('Please Provide Valid Input');
           //set city and country
        //    this.city = city;
        //    this.country = country;
           //setting data to weather data store;
          // weatherStore.fetchData();
          weatherStore.city = city;
          weatherStore.country = country;

          //setting to localStorage;
          storage.city = city;
          storage.country = country;
          storage.saveItem();
        // send request to API server;
       const data = await weatherStore.fetchData();
         //if(data.cod === 404){
             if(Number(data.cod)>404){
             this.showMessage(data.message);
         }else{
             this.printWeather(data);
         }
       //console.log(data);
       //this.printWeather(data);


        })
        document.addEventListener('DomContentLoaded', async(e) =>{
            //load data from localStorage;
            if(localStorage.getItem('BD-weather-city')){
                //setting data to data store
                weatherStore.city = localStorage.getItem('BD-weather-city');
            }
            if(localStorage.getItem('BD-weather-country')){
                weatherStore.country = localStorage.getItem('BD-weather-country');
            }
            
            //send request to API server
            const data =await weatherStore.fetchData()
            //show data to UI
            this.printWeather(data);
        })
   }
}
UI.init();
// const storage = {

// }
