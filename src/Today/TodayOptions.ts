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

import i18next from "i18next";

const en = require("../../languages/en.json");
const fr = require("../../languages/fr.json");

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
    const { h, ref, reactive } = ctx;

    let isAccountDataLoaded = ref(false)
    let account = reactive({});

    OptionsContext.getAccountData("unsplash", "me", (accountId: number | undefined) => {
      isAccountDataLoaded.value = typeof accountId !== "undefined";
      console.log(accountId, 'onchange')
      account.value = {};
    }, { extra: 'parameters' })
      .value
      .then((acc: any) => {
        isAccountDataLoaded.value = true;
        account.value = acc;
        console.log('account data successfully fetched', account)
      });

    const { Field, Toggle, Select } = OptionsContext.components;
    return () => [
      h(isAccountDataLoaded.value && Field, { label: "Nom du compte (live fetching)" }, () => account.value.name),
      h(Field, { class: 'flex-1', label: "Catégorie" }, () => [
        h(Select, {
          options: [
            {name: 'nature'},
            {name: 'animals'},
            {name: 'culture'},
          ],
          placeholder: "Choisissez une catégorie",
          keyProp: 'name',
          ...update.option("category")
        })
      ]),
      // ]),
      h(Toggle, { class: 'flex-1', ...update.option("saint") }, () => "Affiche le saint du jour."),
    ]
  }
}
