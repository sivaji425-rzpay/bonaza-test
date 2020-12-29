import React, { Component } from "react";
import "./Form.css";
import {dummyJson} from "../../dummy";
import SuccessPage from "../SuccessPage/SuccessPage";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      code: "",
      clientName: "",
      Product: "",
      Bank: "",
      Account: "",
      IFSCcode: "",
      Amount: "",
      order:[],
      orderId:""
    };

  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };

  //LIFE CYCLE METHOD
  componentDidMount = async () => {
     const { code } = this.state;
     const proxyurl = "https://cors-anywhere.herokuapp.com/";
     const url = `http://staff.bonanzaonline.com/bplapi/index_live.php?fn=getClientBankInfo&ClinetID=${code}`; // site that doesn’t send Access-Control-*
     const response = await fetch(proxyurl + url);
     const json = await response.json();
     this.setState({ data: json.data });
   };

  //HANDLE GO BUTTON FUNCTIONALITY
  handleGo = async (e) => {
    e.preventDefault();
    const { code, data , payment_id} = this.state;
    console.log(data);
    this.componentDidMount();
    if (!code) {
      alert("Please Enter a client code and press Go..");
    } else {
      for (let key in data) {
        var obj = data[key];
        if (key === "EXCHANGELST") {
          this.exchangeList();
          break;
        } else {
          document.querySelector(".error").classList.add("hide");
          this.setState({
            clientName: obj["CLIENTNAME"],
          });
          return true;
        }
      }
    }
  };
  exchangeList = () => {
    document.querySelector(".error").classList.add("show");
    document.querySelector(".error").innerHTML = "Enter a valid Client code";
  };

  handleProduct = () => {
    const { data } = this.state;
    for (let key in data) {
      var obj = data[key];
      if (key === "EXCHANGELST") {
        this.exchangeList(key);
        break;
      }
      var productType = obj["FIRMNUMBER"].split("-");
      var productValue = document.querySelector(".Product").value;
      if (
        (productValue === "Equity" && productType[0] === "BPL") ||
        (productValue === "Commodity" && (productType[0] === "BBP"||productType[0] === "BCBL") )
      ) {
        this.setState({
          Bank: obj["BANKNAME"],
          Account: obj["BANKACCOUNTNUMBER"],
          IFSCcode: obj["CMICRBANKCODE"],
        });
        break;
      }
    }
  };

  handleResponse= async (response) =>{
    
    var data = JSON.stringify(
      {
      "rzpay_order_id":response.razorpay_order_id,
      "rzpay_pay_id":response.razorpay_payment_id,
      "rzpay_signature":response.razorpay_signature
      }
    );
    var config = {
      method: 'post',
      url: 'http://127.0.0.1:8000/payment/',
      headers:{    
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' :'origin-list',
        'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content') 
      },
      data:data
    };

    var resp = await axios(config)
    .then(response => { return JSON.stringify(response.data)})
    .catch(function (error) {
      console.log(error);
      return error;
    });

    // console.log('handleResp');
    // console.log(resp);
    return resp;

  }

  handleSubmit = async (event) => {

    var isUPI = false;
    var isNEFT = false;
    event.preventDefault();
    const {
      code,
      clientName,
      Bank,
      Account,
      IFSCcode,
      Amount,
    } = this.state;

    if (
      code == "" ||
      clientName == "" ||
      Account == "" ||
      Amount == "" ||
      IFSCcode == ""
    ) {
      alert("Please fill all the fields");
    } else {
      let rates = document.getElementsByName("Myradio");
      rates.forEach((rate) => {
        if (rate.checked && rate.value === "UPI") {
          isUPI = true;
        }
      });
      if (isUPI) {
        const res = await loadRazorpay(
          "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!res) {
          alert("SDK failed to load");
        }

        var data = JSON.stringify({"amount":this.state.Amount*100,"currency":"INR","receipt":"Receipt no. 1","payment_capture":1,"notes":{"notes_key_1":"Shoes, Formal shoes"}});

        var config = {
          method: 'post',
          url: 'https://api.razorpay.com/v1/orders',
          headers:{    
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' :'origin-list',
            'Authorization': 'Basic cnpwX3Rlc3RfWGRyNEtNMmVRT3owWDc6clUxSURTNHdtaGQ4c0l4M0tOQ3NUUWxs'
        },
          data : data
        };

        var ordid = await axios(config)
        .then(response => { return JSON.stringify(response.data) } )
        .catch(function (error) {
          console.log(error);
          return error;
        });

        console.log('O_Id');
        console.log(JSON.parse(ordid));
        var orderData = JSON.parse(ordid);
        var id =orderData.id;

        var options = {
          // key: "rzp_test_hXJGZqsntL4I1a",
          key: "rzp_test_Xdr4KM2eQOz0X7",
          amount: `${(this.state.Amount*100)}`,
          name: "Fund Transfer",
          description: "Payment for BRD",
          image: "https://www.bonanzaonline.com/images/download.png",
          order_id: id,

          handler: async (response) => {

            console.log(response);
            
            //Record response to the server
            var resp = await this.handleResponse(response);
            // console.log('resp');
            // console.log(resp);
            // console.log('resp.success');
            // console.log(JSON.parse(resp));
            var res_data = JSON.parse(resp);

            if(res_data !== undefined){
              try{

                if(res_data.success)
                {
                  var resData = res_data.success;
                  // console.log('resData');
                  // console.log(resData);
                  // console.log(resData.success);

                  var amt = resData.Amount;
                  var bank = resData.Bank;
                  var contact = resData.Contact;
                  var email = resData.Email;
                  var pay_method = resData.Method;
                  var status = resData.Status;
                  var trns_date = resData.Transaction_date;
                }

                //state
              }
              catch(errror){
                  console.error("Not a JSON response")
              }
          }
            // End of server record

            const {Amount}= this.state;
            var values ={
                paymentid : response.razorpay_payment_id,
                transactionamount : Amount,
            }
            if(values.paymentid){
                
              this.props.history.push({
                pathname: '/success',
                state: { 
                  payid: response.razorpay_payment_id,
                  amt:amt,
                  email:email,
                  contact:contact,
                  bank:bank,
                  status:status,
                  method:pay_method,
                  trans_date: trns_date
                }
              })
             
            }else{
              alert('hi')
            }
          },
          prefill: {
            name: "Gaurav Kumar",
            email: "gaurav.kumar@example.com",
            contact: "9999999999",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "blue",
          },
        };
        var paymentObject = new window.Razorpay(options);
        paymentObject.open();
        function loadRazorpay(src) {
          return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            document.body.appendChild(script);
            script.onload = () => {
              resolve(true);
            };
            script.onerror = () => {
              resolve(false);
            };
          });
        }
      } else {
        let rates = document.getElementsByName("Myradio");
        rates.forEach((rate) => {
          if (rate.checked && rate.value === "NEFT") {
            isNEFT = true;
          }
        });

        //Manage NEFT/RTGS section
        if (isNEFT) {
        
        //****************************/
        //***** Create customer ******/
        //****************************/
        
        var data = JSON.stringify(
          {
            "name":"Test Acc 8",
            "contact":"9123456108",
            "email":"test.acc108@example.com",
            "fail_existing":"0",
            "notes":{
              "notes_key_1":"creating Test Acc 8 customer",
              "notes_key_2":"create policy payment for Test Acc 8"
            }
          }
        );

        var config = {
          method: 'post',
          url: 'https://api.razorpay.com/v1/customers',
          headers:{    
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' :'origin-list',
            'Authorization': 'Basic cnpwX3Rlc3RfWGRyNEtNMmVRT3owWDc6clUxSURTNHdtaGQ4c0l4M0tOQ3NUUWxs'
        },
          data : data
        };

        var customer = await axios(config)
        .then(response => { return JSON.stringify(response.data) } )
        .catch(function (error) {
          console.log(error);
          return error;
        });

        console.log('customer');
        var cust = JSON.parse(customer);
        console.log(cust);
        var custId = cust.id;

        //******************************/
        //*** Create Virtual account **/
        //*****************************/

        var data = JSON.stringify(
          {
            "receivers": {
              "types": [
                "bank_account"
              ]
            },
            "description": "Test transaction from Test Acc 8",
            // "customer_id": custId,
            "customer_id": custId,
            "notes":{
              "notes_key_1":"creating Test Acc 8 customer",
              "notes_key_2":"create policy payment for Test Acc 8."
            }
          }
        );
        
        var config = {
          method: 'post',
          url: 'https://api.razorpay.com/v1/virtual_accounts',
          headers: { 
            'Authorization': 'Basic cnpwX3Rlc3RfWGRyNEtNMmVRT3owWDc6clUxSURTNHdtaGQ4c0l4M0tOQ3NUUWxs', 
            'Content-Type': 'application/json'
          },
          data : data
        };

        var vaccount = await axios(config)
        .then(response => { return JSON.stringify(response.data) } )
        .catch(function (error) {
          console.log(error);
          return error;
        });

        console.log('vaccount');
        console.log(vaccount);
        var virtualAcc = JSON.parse(vaccount);
        console.log(virtualAcc);
        // var custId = cust.id;

        //******************************/
        //***** Create transaction ****/
        //*****************************/


        //*********************************/
        //**** redirect to success page ***/
        //*********************************/
        

        }
      }
    }
  };
  render() {
    return (
      <div className=" col-lg-7 col-sm-8  col-10 form-valid">
        <div className="error  font-weight-bold mx-auto text-center h5">
          <p className="text-center">
            Please Enter a client code and press Go..
          </p>
        </div>
        <form onSubmit={this.handleSubmit} className="pt-1 formValid">
          <div className="form-group row">
            <label className="col-lg-3 col-10 col-form-label">
              Client Code
            </label>
            <div className="col-lg-6 col-12">
              <input
                className="form-control codes "
                type="text"
                placeholder="Client Code"
                name="code"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </div>
            <button
              className="btn btn-success col-lg-1 ml-3 col-2 code-btn "
              onClick={this.handleGo}
            >
              Go
            </button>
          </div>
          <div className="form-group row">
            <label className="col-lg-3 col-12 col-form-label">
              Client Name
            </label>
            <div className="col-lg-8 col-12">
              <input
                className="form-control"
                disabled
                type="search"
                placeholder="Client Name"
                name="clientName"
                value={this.state.clientName}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-group row ">
            <label className="col-lg-3 col-12">Select Product</label>
            <div className="col-lg-8 col-12">
              <select
                className="form-control Product"
                name="Product"
                value={this.state.name}
                onChange={this.handleProduct}
              >
                <option>Select a Product</option>
                <option>Equity</option>
                <option>Commodity</option>
              </select>
            </div>
          </div>
          <div className="form-group row ">
            <label className="col-lg-3 col-12">Select Bank</label>
            <div className="col-lg-8 col-12">
              <select
                className="form-control"
                name="Bank"
                value={this.state.Bank}
                onChange={this.handleChange}
              >
                <option>{this.state.Bank}</option>
              </select>
            </div>
          </div>

          <div className="form-group row ">
            <label className="col-lg-3 col-12">Select Account</label>
            <div className="col-lg-8 col-12">
              <select
                className="form-control"
                name="Account"
                value={this.state.Account}
                onChange={this.handleChange}
              >
                <option>{this.state.Account}</option>
              </select>
            </div>
          </div>
          <div className="form-group row ">
            <label className="col-lg-3 col-12 col-form-label">IFSC Code</label>
            <div className="col-lg-8 col-12">
              <input
                className="form-control"
                type="search"
                disabled
                placeholder="IFSC Code"
                name="IFSCcode"
                value={this.state.IFSCcode}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-group row ">
            <label className="col-lg-3 col-12 col-form-label">
              Enter Amount
            </label>
            <div className="col-lg-8 col-12">
              <input
                className="form-control"
                type="search"
                placeholder="Enter Amount"
                name="Amount"
                value={this.state.Amount}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="text-white text-center mb-2 font-weight-bold">
            <div className="form-check-inline mr-5">
              <label className="form-check-label">
                <input
                  type="radio"
                  className="form-check-input"
                  name="Myradio"
                  value="NEFT"
                />{" "}
                NEFT/RTGS
              </label>
            </div>
            <div className="form-check-inline ml-5">
              <label className="form-check-label">
                <input
                  type="radio"
                  className="form-check-input"
                  name="Myradio"
                  value="UPI"
                />{" "}
                UPI
              </label>
            </div>
          </div>

          <div className="p-2 text-center">
            <button type="submit" className="btn btn-primary" >
              Submit
            </button>
            <button
              type="submit"
              className="btn btn btn-light cancel ml-3 text-white"
              onClick={this.handleDelete}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}
export default Form;