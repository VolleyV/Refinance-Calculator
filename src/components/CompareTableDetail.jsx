// const CompareTableDetail = ({ compareaTableData }) => {
//   if (!Array.isArray(compareaTableData) || compareaTableData.length === 0) {
//     return <p>ไม่มีข้อมูล กรุณากลับไปกรอกแบบฟอร์มก่อน</p>;
//   }

//   // กรองข้อมูลที่ไม่มีค่าออกก่อนแมป

//   return (
//     <div className="container mx-auto mt-10 px-4">
//       <h2 className="text-2xl font-bold">ตารางการคำนวณ</h2>
//       <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
//         <thead className="bg-[#082044] text-white">
//           <tr>
//             <th className="px-6 py-4">งวดที่</th>
//             <th className="px-6 py-4">วันที่</th>
//             <th className="px-6 py-4">อัตราดอกเบี้ย</th>
//             <th className="px-6 py-4">ผ่อนต่อเดือน</th>
//             <th className="px-6 py-4">เงินต้น</th>
//             <th className="px-6 py-4">ดอกเบี้ย</th>
//             <th className="px-6 py-4">ยอดคงเหลือ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {compareaTableData.map((detail, index) => (
//             <tr
//               key={index}
//               className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
//             >
//               <td className="border px-6 py-4 text-center">{detail?.month}</td>
//               <td className="border px-6 py-4 text-center">
//                 {detail?.date &&
//                   new Date(detail.date).toLocaleDateString("th-TH", {
//                     year: "numeric",
//                     month: "short",
//                     day: "2-digit",
//                   })}
//               </td>
//               <td className="border px-6 py-4 text-center">
//                 {detail?.interestRate?.toLocaleString()}%
//               </td>
//               <td className="border px-6 py-4 text-center">
//                 {detail?.monthlyPayment?.toLocaleString()}
//               </td>
//               <td className="border px-6 py-4 text-center">
//                 {detail?.loanAmountPortion?.toLocaleString()}
//               </td>
//               <td className="border px-6 py-4 text-center">
//                 {detail?.interest?.toLocaleString()}
//               </td>
//               <td className="border px-6 py-4 text-center">
//                 {detail?.remainingLoanAmount?.toLocaleString()}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CompareTableDetail;
