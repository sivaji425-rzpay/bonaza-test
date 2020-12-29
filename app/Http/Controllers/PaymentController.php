<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Log;
use Razorpay\Api\Api;
use App\Models\Transactions;

class PaymentController extends Controller
{
    public function payment(Request $request)
    {
		Log::info($request);

		
		// 'rzpay_order_id' => 'order_G9f8qSMyG4F8fI',
		// 'rzpay_pay_id' => 'pay_G9f8vu6pkfvL7t',
		// 'rzpay_signature' => '7c0a8f932'


        $input = $request->all();
        $api = new Api("rzp_test_Xdr4KM2eQOz0X7", "rU1IDS4wmhd8sIx3KNCsTQll");
        // $api = new Api(env('RAZOR_KEY'), env('RAZOR_SECRET'));

        $data= [];
		
		if(!empty($input['rzpay_pay_id'])) {
            try {
				$payment = $api->payment->fetch($input['rzpay_pay_id']);
					$data= [
						"Id"=>$payment->id,
						"Email"=>$payment->email,
						"Contact"=>$payment->contact,
						"Amount"=>$payment->amount,
						"Status"=>$payment->status,
						"Method"=>$payment->method,
						"Bank"=>$payment->bank,
						"Transaction_date" =>date("Y-m-d H:i:s", $payment->created_at)
						];

				$trans = new Transactions;
				$trans->razorpay_order_id = $request->input('rzpay_order_id');
				$trans->razorpay_payment_id = $request->input('rzpay_pay_id');
				$trans->razorpay_signature = $request->input('rzpay_signature');
				$trans->email =$data['Email'];
				$trans->contact = $data['Contact'];
				$trans->amount = $data['Amount'];
				$trans->status = $data['Status'];
				$trans->bank = $data['Bank'];
				$trans->method = $data['Method'];
				$trans->trans_date = $data['Transaction_date'];
				$trans->save();
				
				// Log::info('Trans');
				// Log::info($trans);
				return response()->json(['success' => $data, 200]);

            } catch (\Exception $e) {
				Log::info($e->getMessage());
                return  response()->json(['Error' => 'Error fetching payment details', 500]);
            }
        }
		
        return  response()->json(['Error' => 'Error fetching payment details', 500]);
	}
	
	public function paymentstatus(Request $request)
	{
		Log::info("Payment status");
		Log::info($request);
		// return view('test');
		// return redirect('/success');
		// return redirect()->route('/success');
		return redirect()->route('/success/?pay='.$request->get('razorpay_payment_id'));
		
	}
}
