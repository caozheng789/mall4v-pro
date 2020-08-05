export const tableOption = {
  menuAlign: 'center',
  align: 'center',
  refreshBtn: true,
  menu: false,
  searchSize: 'mini',
  addBtn: false,
  column: [
    // 列表数据
    {
      label: '产品名称',
      prop: 'prodName',
      search: true
    }, {
      label: '产品图片',
      prop: 'pic',
      slot: true
    }, {
      label: '佣金数额',
      width: 200,
      prop: 'incomeAmount'
    }, {
      label: '分销员',
      width: 200,
      prop: 'nickName',
      search: true
    }, {
      label: '手机号',
      width: 200,
      prop: 'userMobile',
      search: true
    }, {
      width: 200,
      label: '分销状态',
      search: true,
      type: 'select',
      prop: 'state',
      slot: true,
      dicData: [
        {
          label: '待支付',
          value: 0
        }, {
          label: '待结算',
          value: 1
        }, {
          label: '已结算',
          value: 2
        }, {
          label: '订单失效',
          value: -1
        }
      ]
    }
  ]
}
