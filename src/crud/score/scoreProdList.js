export const tableOption = {
  border: true,
  // selection: true,
  index: false,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 350,
  align: 'center',
  refreshBtn: true,
  searchSize: 'mini',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [{
    label: '产品名字',
    prop: 'prodName',
    search: true
  }, {
    label: '商品原价',
    prop: 'oriPrice'
  }, {
    label: '商品现价',
    prop: 'price'
  }, {
    label: '商品所需积分',
    prop: 'scorePrice'
  }, {
    label: '商品库存',
    prop: 'totalStocks'
  }, {
    label: '产品图片',
    prop: 'pic',
    type: 'upload',
    width: 150,
    listType: 'picture-img'

  }, {
    width: 150,
    label: '状态',
    prop: 'status',
    search: true,
    slot: true,
    type: 'select',
    dicData: [
      {
        label: '下架',
        value: 0
      }, {
        label: '上架',
        value: 1
      }, {
        label: '违规下架',
        value: 2
      }, {
        label: '待审核',
        value: 3
      }
    ]
  }, {
    width: 150,
    label: '产品类别',
    prop: 'type',
    search: true,
    slot: true,
    type: 'select',
    dicData: [
      {
        label: '商品',
        value: 1
      }, {
        label: '优惠券',
        value: 1
      }
    ]
  }]
}
