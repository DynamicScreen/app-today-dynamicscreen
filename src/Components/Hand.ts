import {defineComponent, h} from "vue";

export default defineComponent({
    setup() {

        return () =>
            h("div", {
                class: "bg-white top-1/2 origin-top absolute rounded-xl"
            })
    }
})