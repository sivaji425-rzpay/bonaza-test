import React, { Component } from "react";
import "./SuccessPage.css";
class SuccessPage extends Component {
  render() {
    return (
      <div className="my-5">
        <div className="content col-lg-5 py-3 col-10 mx-auto">
          <div className="col-lg-12 text-center mt-5">
            <p className="text-success text-16 line-height-07">
              <i className="fa fa-check-circle-o fa_custom fa-5x"></i>
            </p>
            <h1 className="">Transaction Successful</h1>
          </div>
          <div className=" mx-auto mt-3">
            <div className="p-3 p-sm-4 mb-2">
              <div className="row">
                <div className="col-sm font-weight-bold">Payment ID</div>
                <div className="col-sm text-sm-right font-weight-600">
                  PHDF173076359
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm font-weight-bold">Date of Transaction</div>
                <div className="col-sm text-sm-right font-weight-600">
                  06-Feb-2019
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm font-weight-bold">Method</div>
                <div className="col-sm text-sm-right font-weight-600">UPI</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm font-weight-bold">Transaction Status</div>
                <div className="col-sm text-sm-right font-weight-bold text-success">
                  Success
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm font-weight-bold">Payment Amount</div>
                <div className="col-sm text-sm-right text-6 font-weight-500">
                  $135
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SuccessPage;