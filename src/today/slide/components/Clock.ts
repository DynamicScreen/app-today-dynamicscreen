import {defineComponent, h, toRef} from "vue";
import Hand from "./Hand";

export default defineComponent({
    props: {
        hours: { type: Number, required: true },
        minutes: { type: Number, required: true }
    },
    setup(props) {

        const hours = toRef(props, "hours");
        const minutes = toRef(props, "minutes");

        const hoursAngle = 180 + (hours.value * 360) / 12;
        const minutesAngle = 180 + (minutes.value * 360) / 60;

        return () =>
            h("div", {
                class: "clock flex rounded-full p-8 relative border-4 w-40 h-40"
            }, [
                h("div", {
                    class: "clock-face flex items-center justify-center relative w-full h-full"
                }, [
                    h(Hand, {
                        class: "hour-hand w-1 h-10",
                        style: {
                            transform: "rotate(" + hoursAngle + "deg)"
                        }
                    }),
                    h(Hand, {
                        class: "minute-hand w-1 h-16",
                        style: {
                            transform: "rotate(" + minutesAngle + "deg)"
                        }
                    }),
                    h("div", {
                        class: "mid-dot bg-white rounded-full w-3 h-3"
                    })
                ])
            ])
    }

})