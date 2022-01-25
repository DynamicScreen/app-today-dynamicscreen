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

    this.context.getAccountData?.("unsplash-official", "me", {
      onChange: (accountId: number | undefined) => {
        if (typeof accountId === "undefined") {
          isAccountDataLoaded.value = false
      }
        console.log('onchange account', accountId)
        if (accountId === undefined) {
          account.value = {};
        }
      }
    })
      .value?.then((acc: any) => {
        isAccountDataLoaded.value = true;
        account.value = acc;
        console.log('account data successfully fetched', account)
      }).catch((err) => {
        console.log('error while fetching account data: ', err)
        isAccountDataLoaded.value = false;
      });

    const update = this.context.update;
    const { Field, Toggle, Select } = this.context.components;

    return () => [
      h(isAccountDataLoaded.value && Field, { label: "Nom du compte (live fetching)" }, () => account.value.name),
      h(Field, { class: 'flex-1', label: this.t('modules.today.options.category.label') }, () => [
        h(Select, {
          options: [
            {name: this.t('modules.today.options.categories.nature'), key: 'nature'},
            {name: this.t('modules.today.options.categories.animals'), key: 'animals'},
            {name: this.t('modules.today.options.categories.culture'), key: 'culture'},
          ],
          placeholder: this.t('modules.today.options.category.select_placeholder'),
          keyProp: 'key',
          valueProp: 'name',
          ...update.option("category")
        })
      ]),
      h(Toggle, { class: 'flex-1', ...update.option("saint") }, () => this.t('modules.today.options.display_saint')),
    ]
  }
}
