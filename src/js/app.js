class App {
  
    constructor() {
  
      $( "#select-provider" ).change(()=>{
        const selectedId = $("#select-provider").val();
        if(selectedId!="fallback") this.showProvider(selectedId,null);
      });

      $( "#button-new-provider" ).click(()=>{
        const newProviderName = $("#new-provider-name").val();
        if(newProviderName.length > 2) this.showProvider(null,newProviderName);
        else this.showAlert("Name zu kurz");
      });

      this.currentProvider = null;
      this.tariffs = [];
      this.currentTariff = null;
      
      this.showProviderSelection();
      this.registerConverters();
    }

    initProviderList(){
      this.providers = [
        {
          id: "fallback",
          name: "Bitte wählen",
          default: true
        },
        {
          "id": "123",
          "name": "Energie Steiermark"
        },
        {
          "id": "456",
          "name": "Linz AG"
        }
      ]

      const providerHtml = $.templates("#providerSelectionTempl").render(this.providers);
      $("#select-provider").html(providerHtml);   
    }

    showProvider(id, newProviderName) {
      $("#provider-container").hide();
      $("#tariffs-container").show();

      if (id){
        this.currentProvider = this.providers.find(p=>p.id == id);
        this.tariffs = this.loadTariffs();
      }
      else {
        this.currentProvider = { id: this.uuid(), name: newProviderName };
        this.tariffs = this.loadTariffs();
      }

      const providerHtml = $.templates("#providerTempl").render(this.currentProvider);
      $("#provider-general-container").html(providerHtml);   

      const tariffsListHtml = $.templates("#tariffTempl").render(this.tariffs);
      $("#tariffs-list-container").html(tariffsListHtml);  
    }

    showProviderSelection(){
      $("#tariffs-container").hide();
      $("#provider-container").show();
      this.initProviderList();
    }

    loadTariffs(){
      return [
        {
          id: this.uuid(),
          name: "TIWAG Mobil",
          chargeCardId: "123",
          providerCustomerOnly: true,
          flatRate: true,
          url: "http://www.google.at",
          monthlyMinSales: 10,
          monthlyFee: 15,
          yearlyServiceFee: 20,
          validFrom: new Date().getTime(),
          validTo: new Date().getTime(),
          prices: [
            {
              id: this.uuid(),
              restrictions: [
                {
                  id: this.uuid(),
                  metric: "car_ac_phases",
                  value: 3,
                  allowance: "allow"
                },
                {
                  id: this.uuid(),
                  metric: "connector_energy",
                  value: "ac",
                  allowance: "allow"
                },
                {
                  id: this.uuid(),
                  metric: "region",
                  value: ["at","de"],
                  allowance: "allow"
                },
                {
                  id: this.uuid(),
                  metric: "connector_speed",
                  value: [3.7,11,22],
                  allowance: "deny"
                },
                {
                  id: this.uuid(),
                  metric: "network",
                  value: ["Maingau"],
                  allowance: "allow"
                }
              ],
              decomposition: [
                {
                  id: this.uuid(),
                  degree: "linear",
                  price: 0.04,
                  dimension: "kwh",
                  rangeGte: null,
                  rangeLte: 40
                },
                {
                  id: this.uuid(),
                  degree: "linear",
                  price: 0.04,
                  dimension: "minute",
                  rangeGte: 20,
                  rangeLte: null
                },
                {
                  id: this.uuid(),
                  degree: "linear",
                  price: 0.04,
                  dimension: "minute",
                  rangeGte: 20,
                  rangeLte: 40
                },
                {
                  id: this.uuid(),
                  degree: "constant",
                  price: 4
                }
              ]
            },
            {
              id: this.uuid(),
              restrictions: [
                {
                  id: this.uuid(),
                  metric: "car_ac_phases",
                  value: 3,
                  allowance: "allow"
                },
                {
                  id: this.uuid(),
                  metric: "connector_energy",
                  value: "ac",
                  allowance: "allow"
                },
                {
                  id: this.uuid(),
                  metric: "region",
                  value: ["at","de"],
                  allowance: "allow"
                },
                {
                  id: this.uuid(),
                  metric: "connector_speed",
                  value: [3.7,11,22],
                  allowance: "deny"
                },
                {
                  id: this.uuid(),
                  metric: "network",
                  value: ["Maingau"],
                  allowance: "allow"
                }
              ],
              decomposition: [
                {
                  id: this.uuid(),
                  degree: "linear",
                  price: 0.04,
                  dimension: "kwh",
                  rangeGte: null,
                  rangeLte: 40
                },
                {
                  id: this.uuid(),
                  degree: "linear",
                  price: 0.04,
                  dimension: "minute",
                  rangeGte: 20,
                  rangeLte: null
                },
                {
                  id: this.uuid(),
                  degree: "linear",
                  price: 0.04,
                  dimension: "minute",
                  rangeGte: 20,
                  rangeLte: 40
                },
                {
                  id: this.uuid(),
                  degree: "constant",
                  price: 4
                }
              ]
            }
          ]
        },
        {
          id: this.uuid(),
          name: "TIWAG Mobil",
          chargeCardId: "123",
          providerCustomerOnly: false,
          flatRate: false,
          url: "http://www.google.at",
          monthlyMinSales: 10,
          monthlyFee: 15,
          yearlyServiceFee: 20,
          validFrom: null,
          validTo: null,
          prices: []
        },
        {
          id: this.uuid(),
          name: "TIWAG Mobil",
          chargeCardId: "123",
          providerCustomerOnly: false,
          flatRate: true,
          url: "http://www.google.at",
          monthlyMinSales: 10,
          monthlyFee: 15,
          yearlyServiceFee: 20,
          validFrom: new Date().getTime(),
          validTo: null,
          prices: [],
        }
      ]
    }
  
    showAlert(message) {
      $("#snackbar").text(message);
      $("#snackbar").show();
      
      setTimeout(()=>$("#snackbar").hide(), 5000);
    }

    registerConverters(){
      $.views.converters({
        dec: val => val.toFixed(2),
        date: val => moment(new Date(val)).format("YYYY-MM-DD"),
        rest: val => {
          return {
            "region": "Land",
            "connector_speed": "Ladegeschwindigkeit",
            "connector_energy": "Stromart",
            "network": "Ladenetzwerk",
            "car_ac_phases": "AC-Phasen"
          }[val]
        },
        dimension: val => val=="kwh" ? "kWh" : "min",
        csv: val => Array.isArray(val) ? val.join(", ") : val
     });
    }

    uuid(){
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }
  }