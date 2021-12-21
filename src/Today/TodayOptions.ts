import {
  SlideOptionsModule,
  VueInstance,
  ISlideOptionsContext,
} from "dynamicscreen-sdk-js";

export default class TodayOptionsModule extends SlideOptionsModule {
  constructor(context: ISlideOptionsContext) {
    super(context);
  }

  async onReady() {
    return true;
  };

  setup(props: Record<string, any>, vue: VueInstance, context: ISlideOptionsContext) {
    const { h, ref, reactive } = vue;


    let isAccountDataLoaded = ref(false)
    let account = reactive({});

    this.context?.getAccountData("unsplash", "me", {
      onChange: () => {
        // isAccountDataLoaded.value = typeof accountId !== "undefined";
        console.log('onchange account')
        // account.value = {};
      }
    }, { another: 'parameters' })
      .value
      .then((acc: any) => {
        isAccountDataLoaded.value = true;
        account.value = acc;
        console.log('account data successfully fetched', account)
      });

    const update = context.update;
    const { Field, Toggle, Select } = context.components;

    return () => [
      h(isAccountDataLoaded.value && Field, { label: "Nom du compte (live fetching)" }, () => account.value.name),
      h(Field, { class: 'flex-1', label: this.t('modules.today.options.category.label') }, () => [
        h(Select, {
          options: [
            {name: this.t('modules.today.options.categories.nature')},
            {name: this.t('modules.today.options.categories.animals')},
            {name: this.t('modules.today.options.categories.culture')},
          ],
          placeholder: this.t('modules.today.options.category.select_placeholder'),
          keyProp: 'name',
          ...update.option("category")
        })
      ]),
      h(Toggle, { class: 'flex-1', ...update.option("saint") }, () => this.t('modules.today.options.display_saint')),
    ]
  }
}
