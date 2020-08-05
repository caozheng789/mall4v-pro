export const tableOption = {
  border: true,
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '分销员手机号',
      prop: 'userMobile',
      slot: true,
      search: true,
      hide: true
    },
    {
      label: '分销员昵称',
      prop: 'nickName',
      slot: true
    },
    {
      label: '待结算金额',
      prop: 'unsettledAmount'
    },
    {
      label: '可提现金额',
      prop: 'settledAmount'
    },
    {
      label: '已失效金额',
      prop: 'invalidAmount'
    },
    {
      label: '积累收益',
      prop: 'addupAmount'
    }
  ]
}
