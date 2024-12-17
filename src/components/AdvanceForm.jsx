import React from 'react'

const AdvanceForm = () => {
    return (
        <div id="advanced-content" className="tab-content hidden">
            <h2 className="text-xl font-bold">
                คำนวณรีไฟแนนซ์แบบมีหลายอัตราดอกเบี้ย
            </h2>
            <form id="loan-form-advance" className="space-y-4">
                <div>
                    <label className="loan" for="principal-advance">จำนวณเงินที่กู้ (บาท)</label>
                    <input
                        name="principal-advance"
                        className="w-full rounded-lg border-gray-200 p-3 text-sm"
                        style="border: 1px solid black"
                        placeholder="จำนวณเงินที่กู้ (บาท)"
                        type="number"
                        id="principal-advance"
                        step="0.001"
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="ttime" for="installmentDuration-advance">ระยะเวลาผ่อนกี่ปี</label>
                        <input
                            name="installmentDuration-advance"
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm"
                            style="border: 1px solid black"
                            placeholder="ระยะเวลาผ่อนกี่ปี"
                            type="number"
                            id="installmentDuration-advance"
                        />
                    </div>
                    <div>
                        <label className="tdate" for="start-date-advance">วันที่เริ่มกู้</label>
                        <input
                            name="start-date-advance"
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm"
                            style="border: 1px solid black"
                            type="date"
                            id="start-date-advance"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mt-4">
                    <div id="installment-from-advance">
                        <label>งวดที่</label>
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm"
                            style="border: 1px solid black"
                            placeholder="งวดที่"
                            type="number"
                            value="1"
                            readonly
                        />
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                            style="border: 1px solid black"
                            placeholder="งวดที่"
                            type="number"
                        />
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                            style="border: 1px solid black"
                            placeholder="งวดที่"
                            type="number"
                        />
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                            style="border: 1px solid black"
                            placeholder="งวดที่"
                            type="number"
                        />
                    </div>
                    <div id="installment-to-advance">
                        <label>ถึงงวดที่</label>
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm"
                            style="border: 1px solid black"
                            placeholder="ถึงงวดที่"
                            type="number"
                        />
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                            style="border: 1px solid black"
                            placeholder="ถึงงวดที่"
                            type="number"
                        />
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                            style="border: 1px solid black"
                            placeholder="ถึงงวดที่"
                            type="number"
                        />
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                            style="border: 1px solid black"
                            placeholder="ถึงงวดที่"
                            type="number"
                        />
                    </div>
                    <div id="interest-advance">
                        <label>อัตราดอกเบี้ย</label>
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm"
                            step="0.001"
                            style="border: 1px solid black"
                            placeholder="อัตราดอกเบี้ย"
                            type="number"
                        />
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                            step="0.001"
                            style="border: 1px solid black"
                            placeholder="อัตราดอกเบี้ย"
                            type="number"
                        />
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                            step="0.001"
                            style="border: 1px solid black"
                            placeholder="อัตราดอกเบี้ย"
                            type="number"
                        />
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                            step="0.001"
                            style="border: 1px solid black"
                            placeholder="อัตราดอกเบี้ย"
                            type="number"
                        />
                    </div>
                    <div id="monthlyPayment-advance">
                        <label>จำนวนเงินที่จะผ่อน</label>
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm"
                            style="border: 1px solid black"
                            placeholder="จำนวนเงินที่จะผ่อน"
                            type="number"
                            step="0.001"
                        />
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                            style="border: 1px solid black"
                            placeholder="จำนวนเงินที่จะผ่อน"
                            type="number"
                            step="0.001"
                        />
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                            style="border: 1px solid black"
                            placeholder="จำนวนเงินที่จะผ่อน"
                            type="number"
                            step="0.001"
                        />
                        <input
                            className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                            style="border: 1px solid black"
                            placeholder="จำนวนเงินที่จะผ่อน"
                            type="number"
                            step="0.001"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <button
                        type="submit"
                        className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto">
                        คำนวณ
                    </button>
                    <button
                        type="reset"
                        className="inline-block w-full rounded-lg bg-red-500 px-5 py-3 font-medium text-white sm:w-auto">
                        Reset
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AdvanceForm