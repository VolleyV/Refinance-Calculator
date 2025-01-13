import React from 'react'

const Showtable = () => {
       
    return (
        <div className="rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold text-center">ตารางสรุปผลการคำนวณ</h2>
            <div className="overflow-x-auto rounded-t-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">งวด</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">วันที่กำหนดชำระ</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">เงินต้น</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ผ่อนเดือนละ</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ดอกเบี้ย</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">เงินต้นคงเหลือ</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">ดอกเบี้ยเงินกู้ยืม(คงค้าง)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    <tr>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">1</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">24/05/1995</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">6,000,000(บาท)</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">21,600(บาท)</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">7,911.01(บาท)</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">5,962,429.14(บาท)</td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">2,790,000(บาท)</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
            <ol className="flex justify-end gap-1 text-xs font-medium">
            <li>
                    <a href="#"
                        className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180">
                        <span className="sr-only">Prev Page</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </a>
                </li>
                <li className="block size-8 rounded border-blue-600 bg-blue-600 text-center leading-8 text-white">
                    1
                </li>
                <li>
                    
                    <a href="#"
                        className="block size-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900">
                        2
                    </a>
                </li>
                <li>
                    <a href="#"
                        className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180">
                        <span className="sr-only">Next Page</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </a>
                </li>
            </ol>
            </div>
        </div>
    )
}

export default Showtable