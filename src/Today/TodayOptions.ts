import {
  ISlideOptionsContext,
  SlideOptionsModule,
  VueInstance,
} from "dynamicscreen-sdk-js"

export default class TodayOptionsModule extends SlideOptionsModule {
  async onReady() {
    return true;
  };

  setup(props: Record<string, any>, vue: VueInstance, context: ISlideOptionsContext) {
    const { h, ref, reactive } = vue;

    let isAccountDataLoaded = ref(false)
    let account: any = reactive({});

    this.context.getAccountData?.("unsplash", "me", {
      onChange: (accountId: number | undefined) => {
        isAccountDataLoaded.value = typeof accountId !== "undefined";
        console.log('onchange account', accountId)
        account = {};
      }
    }, { another: 'parameters' })
      .value?.then((acc: any) => {
        isAccountDataLoaded.value = true;
        account = acc;
        console.log('account data successfully fetched', account)
      });

    const update = this.context.update;
    const { Field, Toggle, Select } = this.context.components;

    return () => [
      h(isAccountDataLoaded.value && Field, { label: "Nom du compte (live fetching)" }, () => account.name),
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
