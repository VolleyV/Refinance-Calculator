/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ShowBankAdvance = ({ advanceCalculateSummary }) => {
  const handleOpenTableInNewTab = () => {
    sessionStorage.setItem(
      "basicTableData",
      JSON.stringify(advanceCalculateSummary)
    );
    window.open("/advanceTable", "_blank");
  };

  const totalLoanRemaining = advanceCalculateSummary.loanAmountAfterThreeYears;
  const totalInterestThreeYears =
    advanceCalculateSummary.totalInterestThreeYears;
  const {
    principalPortionAfterThreeYears,
    totalMonthlyPaymentThreeYears,
    insurance,
    mortgageFee,
    total,
    totalYears,
    totalMonths,
    totalInterestPaid,
    totalMonthlyPayment,
    lastDayOfPaying,
  } = advanceCalculateSummary;

  const circleThreeYears = {
    labels: ["เงินต้น", "ดอกเบี้ย"],
    datasets: [
      {
        label: "# of Votes",
        data: [principalPortionAfterThreeYears, totalInterestThreeYears],
        backgroundColor: ["#082044", "#82828E"],
      },
    ],
  };
  const circleAllYears = {
    labels: ["เงินต้น", "ดอกเบี้ย"],
    datasets: [
      {
        label: "# of Votes",
        data: [totalMonthlyPayment, totalInterestPaid],
        backgroundColor: ["#082044", "#82828E"],
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
  const totalInsuranceMortgage = insurance + mortgageFee;
  let insuranceOrMortgageText;
  if (insurance != 0 && mortgageFee == 0) {
    insuranceOrMortgageText = (
      <div>
        <p>ดอกเบี้ย 3 ปี รวมค่าประกัน</p>
      </div>
    );
  } else if (insurance == 0 && mortgageFee != 0) {
    insuranceOrMortgageText = (
      <div>
        <p>ดอกเบี้ย 3 ปี รวมค่าจดจำนอง</p>
      </div>
    );
  } else {
    insuranceOrMortgageText = (
      <div>
        <p>ดอกเบี้ย 3 ปี รวม</p>
        <p>ค่าจดจำนองและค่าประกัน</p>
      </div>
    );
  }

  let remainingDateText;
  if (totalYears == 0) {
    remainingDateText = `ระยะเวลาผ่อนชำระ ${totalMonths} เดือน`;
  } else if (totalMonths == 0) {
    remainingDateText = `ระยะเวลาผ่อนชำระ ${totalYears} ปี`;
  } else {
    remainingDateText = `ระยะเวลาผ่อนชำระ ${totalYears} ปี ${totalMonths} เดือน`;
  }

  const remainingInterestText = `${totalInterestPaid.toLocaleString()} `;

  const lastPaymentText = `สิ้นสุดการชำระ ณ วันที่: ${new Date(
    lastDayOfPaying
  ).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })}`;

  return (
    <div className="relative p-6 max-w-4xl mx-auto rounded-lg mt-8 bg-white">
      {/* ส่วนข้อมูล */}
      <div className="flex flex-col">
        {/* ส่วนข้อมูลระยะเวลา 3 ปีแรก */}
        <div>
          <h2 className="text-2xl font-bold text-[#082044] text-center">
            ผ่อน 3 ปี แรก
          </h2>
          <p className="text-[#82828E] text-lg text-center mt-2">
            (จำนวนเงิน {totalMonthlyPaymentThreeYears.toLocaleString()} บาท)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center mt-8">
            {/* คอลัมน์ที่ 1 (กราฟและ Legend ด้านล่าง) */}
            <div className="flex flex-col items-center">
              {/* กราฟวงกลม */}
              <div className="w-48 h-48">
                <Doughnut data={circleThreeYears} options={options} />
              </div>

              {/* Legend (ย้ายมาไว้ใต้กราฟ) */}
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
            <div className="grid grid-cols-2 col-span-2 gap-6">
              {/* คอลัมน์ที่ 2 */}
              <div className="text-lg flex flex-col justify-between">
                {/* ผ่อนดอกเบี้ยไป (เส้นกรอบประ) */}
                <div className="border-2 border-dashed border-[#bbbbbb] p-4 rounded-md">
                  <p className="text-start">
                    ผ่อนดอกเบี้ยไป <br />
                    <span className="font-bold text-[#30A572] text-2xl">
                      {totalInterestThreeYears.toLocaleString()}
                    </span>{" "}
                    บาท
                  </p>
                </div>

                {/* ดอกเบี้ยรวมค่าใช้จ่าย */}
                {totalInsuranceMortgage !== 0 && (
                  <div className="text-start p-4">
                    {insuranceOrMortgageText}
                    <span className="font-bold text-[#30A572] text-2xl">
                      {totalInsuranceMortgage.toLocaleString()}
                    </span>{" "}
                    บาท
                  </div>
                )}
                {totalInsuranceMortgage !== 0 ? (
                  <div className="text-start p-4">
                    {insuranceOrMortgageText}
                    <span className="font-bold text-[#30A572] text-2xl">
                      {totalInsuranceMortgage.toLocaleString()}
                    </span>{" "}
                    บาท
                  </div>
                ) : (
                  <div className="text-start p-4">
                    <p>เหลือเงินต้นต้องผ่อนอีก</p>
                    <span className="font-bold text-[#30A572] text-2xl">
                      {totalLoanRemaining.toLocaleString()}
                    </span>{" "}
                    บาท
                  </div>
                )}
              </div>

              {/* คอลัมน์ที่ 3 */}
              <div className="text-lg flex flex-col justify-between">
                {/* ผ่อนเงินต้นไป */}
                <div className="p-4 text-start">
                  ผ่อนเงินต้นไป <br />
                  <span className="font-bold text-[#30A572] text-2xl">
                    {principalPortionAfterThreeYears.toLocaleString()}
                  </span>{" "}
                  บาท
                </div>

                {/* เหลือเงินต้นต้องผ่อน */}
                {totalInsuranceMortgage !== 0 && (
                  <div className="text-start p-4">
                    <p>เหลือเงินต้นต้องผ่อนอีก</p>
                    <span className="font-bold text-[#30A572] text-2xl">
                      {totalLoanRemaining.toLocaleString()}
                    </span>{" "}
                    บาท
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* เส้นแบ่ง */}
          <div className="border-t border-[#D3D8E2] my-20"></div>

          {/* ส่วนข้อมูลจนถึงสิ้นสุดการชำระ */}
          <div>
            <h2 className="text-2xl font-bold text-[#082044] text-center">
              จะผ่อนหมดต้องใช้เวลา {remainingDateText}
            </h2>
            <p className="text-[#82828E] text-lg text-center mt-2">
              (จะผ่อนเสร็จวันที่ {lastPaymentText})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center mt-8">
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
                  <p>
                    ค่าดอกเบี้ยตลอดการผ่อน <br />
                    <span className="font-bold text-[#30A572] text-2xl">
                      {remainingInterestText.toLocaleString()}
                    </span>{" "}
                    บาท
                  </p>
                </div>

                {/* จะผ่อนเสร็จวันที่ */}
                <p className="text-[#35373F] text-start p-4">
                  จะผ่อนเสร็จวันที่ <br />
                  <span className="font-bold text-[#30A572] text-2xl">
                    {lastPaymentText}
                  </span>
                </p>
              </div>

              {/* คอลัมน์ที่ 3 (เว้นว่างไว้) */}
              <div className="col-span-1"></div>
            </div>

            {/* ปุ่มดูรายละเอียด */}
            <div className="mt-20 text-center">
              <button
                onClick={handleOpenTableInNewTab}
                className="inline-block rounded-full bg-[#30A572] px-8 py-2 text-lg font-bold text-white hover:bg-[#28a062]"
              >
                ดูรายละเอียด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ShowBankAdvance.propTypes = {
  advanceCalculateSummary: PropTypes.shape({
    loanAmountAfterThreeYears: PropTypes.number.isRequired,
    totalInterestThreeYears: PropTypes.number.isRequired,
    principalPortionAfterThreeYears: PropTypes.number.isRequired,
    totalMonthlyPaymentThreeYears: PropTypes.number.isRequired,
    totalYears: PropTypes.number.isRequired,
    totalMonths: PropTypes.number.isRequired,
    totalInterestPaid: PropTypes.number.isRequired,
    totalMonthlyPayment: PropTypes.number.isRequired,
    lastDayOfPaying: PropTypes.string.isRequired,
  }).isRequired,
};

export default ShowBankAdvance;
