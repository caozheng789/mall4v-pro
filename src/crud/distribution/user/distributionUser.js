export const tableOption = {
  border: true,
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
    label: '昵称',
    prop: 'nickName'
  }, {
    label: '分销员手机号',
    search: true,
    prop: 'userMobile'
  },
  {
    label: '邀请人手机号',
    search: true,
    hide: true,
    prop: 'parentUserMobile'
  }, {
    label: '邀请人',
    prop: 'parentName',
    slot: true
  },
  {
    label: '加入时间',
    width: 170,
    prop: 'bindTime',
    sortable: true
  }, {
    label: '累计客户',
    prop: 'boundCustomers',
    sortable: true,
    slot: true
  }, {
    label: '累计邀请',
    prop: 'invitedVeeker',
    sortable: true,
    slot: true
  }, {
    label: '累计收益',
    prop: 'addupAmount',
    sortable: true,
    slot: true

  }, {
    width: 150,
    label: '状态',
    prop: 'state',
    type: 'radio',
    dicData: [
      {
        label: '待审核通过',
        value: 0
      }, {
        label: '正常',
        value: 1
      }, {
        label: '封禁中',
        value: -1
      }, {
        label: '已清退',
        value: 2
      }
    ]
  }
  ]
}
