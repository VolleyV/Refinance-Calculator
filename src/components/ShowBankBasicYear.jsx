/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

const ShowBankBasicYear = ({ basicYearCalculateSummary }) => {
  const handleOpenTableInNewTab = () => {
    sessionStorage.setItem(
      "basicTableData",
      JSON.stringify(basicYearCalculateSummary)
    );
    window.open("/basicYearTable", "_blank");
  };

  const {
    principalAfterThreeYears,
    totalInterestThreeYears,
    principalPortionAfterThreeYears,
    totalMonthlyPaymentThreeYears,
    paymentDuration,
    monthlyPayment,
    insurance,
    mortgageFee,
    // totalYears,
    // totalMonths,
    totalInterestPaid,
    totalMonthlyPayment,
    lastDayOfPaying,
  } = basicYearCalculateSummary;

  // const remainingDateText = `ระยะเวลาผ่อนชำระ ${totalYears} ปี ${totalMonths} เดือน`;

  const totalInsuranceMortgage = insurance + mortgageFee;
  let insuranceOrMortgageText;
  if (insurance != 0 && mortgageFee == 0) {
    insuranceOrMortgageText = (
      <div className="mt-4">
        <p>ดอกเบี้ย 3 ปี รวมค่าประกัน</p>
      </div>
    );
  } else if (insurance == 0 && mortgageFee != 0) {
    insuranceOrMortgageText = (
      <div className="mt-4">
        <p>ดอกเบี้ย 3 ปี รวมค่าจดจำนอง</p>
      </div>
    );
  } else {
    insuranceOrMortgageText = (
      <div className="mt-4">
        <p>ดอกเบี้ย 3 ปี รวม</p>
        <p>ค่าจดจำนองและค่าประกัน</p>
      </div>
    );
  }

  const remainingInterestText = `${totalInterestPaid.toLocaleString()}`;

  const lastPaymentText = `${new Date(lastDayOfPaying).toLocaleDateString(
    "th-TH",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }
  )}`;

  const circleThreeYears = {
    labels: ["เงินต้น", "ดอกเบี้ย"],
    datasets: [
      {
        label: "# of Votes",
        data: [principalPortionAfterThreeYears, totalInterestThreeYears],
        backgroundColor: ["#82828E", "#082044"],
      },
    ],
  };
  const circleAllYears = {
    labels: ["เงินต้น", "ดอกเบี้ย"],
    datasets: [
      {
        label: "# of Votes",
        data: [totalMonthlyPayment, totalInterestPaid],
        backgroundColor: ["#82828E", "#082044"],
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false, // Disable the built-in legend
      },
    },
  };

  return (
    <div className="relative p-6 max-w-4xl mx-auto rounded-lg mt-8 bg-white">
      <div>
        <h2 className="text-2xl text-[#082044] text-center">
          หากต้องการผ่อนหมดภายใน {paymentDuration} ปี
        </h2>
        <h2 className="text-4xl font-bold text-[#082044] text-center mt-4">
          ต้องผ่อนอย่างน้อยเดือนละ {monthlyPayment.toLocaleString()} บาท
        </h2>
      </div>

      {/* เส้นแบ่ง */}
      <div className="border-t-[3px] border-[#082044] my-20 mt-10 mb-10"></div>

      {/* ส่วนข้อมูล */}
      <div className="flex flex-col">
        {/* ส่วนข้อมูลระยะเวลา 3 ปีแรก */}
        <div>
          <h2 className="text-3xl font-bold text-[#082044] text-center">
            ผ่อน 3 ปี แรก
          </h2>
          <p className="text-[#082044] text-xl text-center mt-2">
            (จำนวนเงิน {totalMonthlyPaymentThreeYears.toLocaleString()} บาท)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center mt-8">
            {/* คอลัมน์ 1: กราฟ (แถว 1-2) */}
            <div className="flex flex-col items-center">
              {/* กราฟวงกลม */}
              <div className="w-48 h-48">
                <Doughnut data={circleThreeYears} options={options} />
              </div>

              {/* Legend ของกราฟ (อยู่ล่างกราฟ) */}
              <div className="flex justify-center space-x-4 mt-4">
                {circleThreeYears.labels.map((label, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4"
                      style={{
                        backgroundColor:
                          circleThreeYears.datasets[0].backgroundColor[index],
                      }}
                    ></div>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* คอลัมน์ที่ 2 และ 3 (ข้อมูลการชำระเงิน) */}
            <div className="sm:grid grid-cols-2 col-span-2 gap-6">
              {/* คอลัมน์ที่ 2 */}
              <div className="text-lg flex flex-col justify-between">
                {/* ผ่อนดอกเบี้ยไป (เส้นกรอบประ) */}
                <div className="border-2 border-dashed border-[#bbbbbb] p-4 rounded-md">
                  <p className="text-start text-[#082044]">
                    ผ่อนดอกเบี้ยไป <br />
                    <span className="font-bold text-[#30A572] text-2xl">
                      {totalInterestThreeYears.toLocaleString()}
                    </span>{" "}
                    <span className="font-bold">บาท</span>
                  </p>
                </div>

                {/* ดอกเบี้ยรวมค่าใช้จ่าย */}
                {totalInsuranceMortgage !== 0 ? (
                  <div className="text-start p-4">
                    {insuranceOrMortgageText}
                    <span className="font-bold text-[#30A572] text-2xl">
                      {(
                        totalInterestThreeYears + totalInsuranceMortgage
                      ).toLocaleString()}
                    </span>{" "}
                    <span className="font-bold">บาท</span>
                  </div>
                ) : (
                  <div className="text-start p-4 mt-4">
                    <p className="text-[#082044]">เหลือเงินต้นต้องผ่อนอีก</p>
                    <span className="font-bold text-[#30A572] text-2xl">
                      {principalAfterThreeYears.toLocaleString()}
                    </span>{" "}
                    <span className="font-bold">บาท</span>
                  </div>
                )}
              </div>

              {/* คอลัมน์ที่ 3 */}
              <div className="text-lg flex flex-col justify-between">
                {/* ผ่อนเงินต้นไป */}
                <div className="p-4 text-start">
                  <p className="text-[#082044]">ผ่อนเงินต้นไป </p>
                  <span className="font-bold text-[#30A572] text-2xl">
                    {principalPortionAfterThreeYears.toLocaleString()}
                  </span>{" "}
                  <span className="font-bold">บาท</span>
                </div>

                {/* เหลือเงินต้นต้องผ่อน */}
                {totalInsuranceMortgage !== 0 && (
                  <div className="text-start p-4">
                    <p className="text-[#082044]">เหลือเงินต้นต้องผ่อนอีก</p>
                    <span className="font-bold text-[#30A572] text-2xl">
                      {principalAfterThreeYears.toLocaleString()}
                    </span>{" "}
                    <span className="font-bold">บาท</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* เส้นแบ่ง */}
          <div className="border-t border-[#D3D8E2] my-[40px]"></div>

          {/* ส่วนข้อมูลจนถึงสิ้นสุดการชำระ */}
          <div>
            <h2 className="text-3xl font-bold text-[#082044] text-center">
              ผ่อนจนเสร็จสิ้น
            </h2>
            <p className="text-[#082044] text-xl text-center mt-2 ">
              (จำนวนเงิน {totalMonthlyPayment.toLocaleString()} บาท)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center mt-2">
              {/* คอลัมน์ที่ 1 (กราฟและ Legend ด้านล่าง) */}
              <div className="flex flex-col items-center col-span-1">
                {/* กราฟวงกลม */}
                <div className="w-48 h-48">
                  <Doughnut data={circleAllYears} options={options} />
                </div>

                {/* Legend (ย้ายมาอยู่ใต้กราฟ) */}
                <div className="flex justify-center space-x-4 mt-4">
                  {circleAllYears.labels.map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4"
                        style={{
                          backgroundColor:
                            circleAllYears.datasets[0].backgroundColor[index],
                        }}
                      ></div>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* คอลัมน์ที่ 2 (ข้อมูลดอกเบี้ยและวันผ่อนเสร็จ) */}
              <div className="text-lg flex flex-col justify-between col-span-1">
                {/* ค่าดอกเบี้ยตลอดการผ่อน (เส้นกรอบประ) */}
                <div className="border-2 border-dashed border-[#bbbbbb] p-4 rounded-md text-start">
                  <p className="text-[#082044]">
                    ค่าดอกเบี้ยตลอดการผ่อน <br />
                    <span className="font-bold text-[#30A572] text-2xl">
                      {remainingInterestText.toLocaleString()}
                    </span>{" "}
                    <span className="font-bold">บาท</span>
                  </p>
                </div>
                {/* จะผ่อนเสร็จวันที่ */}
                <p className="text-[#082044] text-start p-4 sm:block inline">
                  จะผ่อนเสร็จวันที่ <br />
                  <span className="inline sm:hidden">&nbsp;</span>
                  <span className="font-bold text-[#30A572] text-2xl sm:block inline">
                    {lastPaymentText}
                  </span>
                </p>
              </div>

              {/* คอลัมน์ที่ 3 (เว้นว่างไว้) */}
              <div className="col-span-1"></div>
            </div>
          </div>
        </div>
      </div>
      {/* ปุ่มดูรายละเอียด */}
      <div className="mt-5 text-center">
        <button
          onClick={handleOpenTableInNewTab}
          className="inline-block rounded-full bg-[#30A572] w-full h-[60px] sm:w-[250px] px-8 py-2 text-lg font-bold text-white hover:bg-[#28a062]"
        >
          ดูรายละเอียด
        </button>
      </div>
    </div>
  );
};

ShowBankBasicYear.propTypes = {
  basicYearCalculateSummary: PropTypes.shape({
    principalAfterThreeYears: PropTypes.number.isRequired,
    totalInterestThreeYears: PropTypes.number.isRequired,
    principalPortionAfterThreeYears: PropTypes.number.isRequired,
    totalMonthlyPaymentThreeYears: PropTypes.number.isRequired,
    insurance: PropTypes.number.isRequired,
    mortgageFee: PropTypes.number.isRequired,
    monthlyPayment: PropTypes.number.isRequired,
    // totalYears: PropTypes.number.isRequired,
    // totalMonths: PropTypes.number.isRequired,
    totalInterestPaid: PropTypes.number.isRequired,
    totalMonthlyPayment: PropTypes.number.isRequired,
    lastDayOfPaying: PropTypes.string.isRequired,
  }).isRequired,
};

export default ShowBankBasicYear;
