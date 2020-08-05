export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  menuWidth: 280,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '秒杀活动id',
      prop: 'seckillId'
    },
    {
      label: '活动名称',
      prop: 'seckillName',
      search: true
    },
    {
      label: '开始时间',
      prop: 'startTime'
    },
    {
      label: '结束时间',
      prop: 'endTime'
    },
    {
      label: '活动标签',
      prop: 'seckillTag'
    },
    {
      label: '限购数量',
      prop: 'maxNum'
    },
    {
      label: '取消订单时间',
      prop: 'maxCancelTime'
    },
    {
      label: '状态',
      prop: 'status',
      search: true,
      slot: true,
      type: 'select',
      dicData: [
        {
          label: '关闭',
          value: 0
        }, {
          label: '开启',
          value: 1
        }, {
          label: '违规下线',
          value: 2
        }, {
          label: '待审核',
          value: 3
        }
      ]
    }
  ]
}
