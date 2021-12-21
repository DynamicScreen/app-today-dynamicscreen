import {
  ISlideContext,
  IPublicSlide,
  SlideModule, VueInstance
} from "dynamicscreen-sdk-js";

import Clock from "../Components/Clock";

export default class TodaySlideModule extends SlideModule {
    constructor(context: ISlideContext) {
        super(context);
    }

    async onReady() {
        return true;
    };

    setup(props: Record<string, any>, vue: VueInstance, context: ISlideContext) {
        const { h, reactive, ref, computed } = vue;

        const slide = reactive(this.context.slide) as IPublicSlide;

        let refreshTimeInterval: number | undefined;

        const saint = ref(slide.data.saint);
        const picture = ref(slide.data.random_photo);
        const author = ref(slide.data.author);

        const now = ref(new Date());
        const hours = computed(() => {
            return now.value.getHours();
        })
        const minutes = computed(() => {
            return now.value.getMinutes();
        })

        this.context.onPrepare(async () => {

        });

        this.context.onReplay(async () => {
        });

        this.context.onPlay(async () => {
            refreshTimeInterval = window.setInterval(() => {
                now.value = new Date();
            }, 1000 * 60);
        });

        this.context.onEnded(async () => {
            if (refreshTimeInterval) { clearInterval(refreshTimeInterval) }
        });

        return () =>
            h("div", {
                class: "flex w-full h-full bg-no-repeat bg-cover",
                style: { backgroundImage: `url(${picture.value})`}
            }, [
                h("div", {
                    class: "flex w-full justify-end"
                }, [
                    h("div", {
                        class: "flex h-full flex-col space-y-5 w-3/12 bg-opacity-40 bg-black justify-center items-center text-white backdrop-filter backdrop-blur-md"
                    }, [
                        h(Clock, {
                            hours: hours.value,
                            minutes: minutes.value
                        }),
                        h("div", {
                            class: "text-8xl font-medium"
                        }, "15:40"),
                        h("div", {
                            class: "text-4xl"
                        }, "Wednesday 13 October"),
                        h("div", {
                            class: "absolute bottom-5 text-center text-lg"
                        }, `${this.t('modules.today.slide.picture_by')} : ${author.value}`)
                    ])
                ])
            ])
    }
}
