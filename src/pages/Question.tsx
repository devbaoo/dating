import { DatePicker, TimePicker } from "antd";
import { pink } from "../components/interfaces/HeartButton.interface";
import Layout from "../layouts/layout";
import dayjs from "dayjs";
import HeartButton from "../components/HeartButton/HeartButton";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

const Question = () => {
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState<{
    date: dayjs.Dayjs | null;
    time: dayjs.Dayjs | null;
  }>({
    date: null,
    time: null,
  });

  const onChangeDate = (date: dayjs.Dayjs | null) => {
    console.log("Selected Date:", date);
    setDateTime((prev) => ({ ...prev, date }));
  };

  const onChangeTime = (time: dayjs.Dayjs | null) => {
    console.log("Selected Time:", time);
    setDateTime((prev) => ({ ...prev, time }));
  };

  // Disable past dates
  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  // Disable past times for the selected date
  const disabledTime = () => {
    const now = dayjs();
    const isToday = dateTime.date && dateTime.date.isSame(now, "day");

    if (isToday) {
      return {
        disabledHours: () =>
          Array.from({ length: 24 }, (_, i) => i).filter(
            (hour) => hour < now.hour()
          ),
        disabledMinutes: (selectedHour: number) =>
          selectedHour === now.hour()
            ? Array.from({ length: 60 }, (_, i) => i).filter(
                (minute) => minute < now.minute()
              )
            : [],
        disabledSeconds: () => [],
      };
    }

    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  };

  const nextQuestion = () => {
    if (dateTime.date && dateTime.time) {
      const combinedDateTime = dayjs(dateTime.date)
        .hour(dateTime.time.hour())
        .minute(dateTime.time.minute());
      const formattedDate = combinedDateTime.format("YYYY-MM-DD");
      const formattedTime = combinedDateTime.format("HH:mm");

      console.log("dateTime:", {
        date: formattedDate,
        time: formattedTime,
      });
      localStorage.setItem(
        "dateTime",
        JSON.stringify({ date: formattedDate, time: formattedTime })
      );
      navigate("/choose");
    } else {
      toast.success("Hãy chọn time và ngày", {
        style: {
          border: "1px solid pink",
          padding: "16px",
          color: pink,
        },
        iconTheme: {
          primary: pink,
          secondary: "#FFFAEE",
        },
      });
    }
  };

  return (
    <Layout>
      <main className="d-flex justify-content-center">
        <section>
          <h1 className="text-center" style={{ color: pink }}>
            Bạn rảnh khi nào?
          </h1>
          <h2 className="text-center" style={{ color: pink }}>
            Bất cứ lúc nào, tui sẽ đến đón bạn ngay! ❤️
          </h2>
          <section className="d-flex flex-column align-items-center pt-3">
            <div className="d-flex gap-3">
              <DatePicker
                size="large"
                onChange={onChangeDate}
                disabledDate={disabledDate}
              />
              <TimePicker
                size="large"
                onChange={onChangeTime}
                disabledTime={disabledTime}
              />
            </div>
          </section>
          <HeartButton
            style={{
              borderRadius: "1rem",
              transition: "transform 0.5s ease-in-out",
              width: "100%",
              marginTop: "1.3rem",
            }}
            text="CLICK ME"
            onClick={nextQuestion}
          />
          <div>
            <Toaster />
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Question;
