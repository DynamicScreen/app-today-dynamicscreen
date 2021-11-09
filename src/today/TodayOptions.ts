import {
  BaseContext,
  AssetDownload,
  IAssetsStorageAbility,
  IGuardsManager,
  ISlideContext,
  IPublicSlide,
  SlideModule,
  SlideUpdateFunctions
} from "dynamicscreen-sdk-js";

import {onMounted, VNode} from 'vue';
import i18next from "i18next";
import Clock from "../components/Clock";

const en = require("../../../languages/en.json");
const fr = require("../../../languages/fr.json");

export default class TodayOptionsModule extends SlideModule {
    constructor(context: ISlideContext) {
        super(context);
    }

    trans(key: string) {
        return i18next.t(key);
    };

    async onReady() {
        return true;
    };

    onMounted() {
        console.log('onMounted')
    }

    //@ts-ignore
    onErrorTracked(err: Error, instance: Component, info: string) {
    }

    //@ts-ignore
    onRenderTriggered(e) {
    }

    //@ts-ignore
    onRenderTracked(e) {
    }

    onUpdated() {
    }

    initI18n() {
        i18next.init({
            fallbackLng: 'en',
            lng: 'fr',
            resources: {
                en: { translation: en },
                fr: { translation: fr },
            },
            debug: true,
        }, (err, t) => {
            if (err) return console.log('something went wrong loading translations', err);
        });
    };

    // @ts-ignore
    setup(props, ctx, update: SlideUpdateFunctions, OptionsContext) {
      const { h } = ctx;

      const { Field, FieldsRow, Toggle, ListPicker } = OptionsContext.components

      return () => [
        h(Field, { label: "Compte Unsplash" }, [
          h(ListPicker, {
            items: [{ id: '228', name: 'unplash account test'}],
            ...update.option("__accounts")
          })
        ]),
        h(FieldsRow, {}, [
          h(Toggle, { class: 'flex-1', ...update.option("saint") }, "Saint"),
          h(Field, { class: 'flex-1', label: "Catégorie" }, [
            h(ListPicker, {
              items: [
                { name: 'nature' },
                { name: 'animals' },
                { name: 'culture'},
              ],
              keyProp: 'name',
              ...update.option("category") })
          ])
        ]),
      ]
    }
}
