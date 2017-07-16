(function (exports) {
    exports.app = new Vue({
        el: '#app',
        data: function () {
            return {
                visible: false,
                idFlag: 0,
                newTask: {
                    id: null,
                    title: '',
                    timeLog: [{
                        start: null,
                        end: null
                    }]
                },
                taskStack: [],
                taskList: [],
                timeLog: {
                    start: null,
                    end: null
                }
            }
        },
        mounted() {
            this.load()
        },
        computed: {
            lastTask: function () {
                if (this.taskStack.length !== 0) {
                    return this.taskStack[0]
                } else {
                    return null
                }
            },
            lastTaskStarted: function () {
                return this.taskStack[0].timeLog[0].start === null
            }
        },
        methods: {
            onPush() {
                let newTask = JSON.parse(JSON.stringify(this.newTask))
                this.taskStack.unshift(newTask)
                this.save()
            },
            onTaskStart() {
                let currentTime = +new Date()
                let length = this.lastTask.timeLog.length - 1

                if (this.taskStack.length > 1) {
                    let timeLogLength = this.taskStack[1].timeLog.length - 1
                    this.taskStack[1].timeLog[timeLogLength].end = currentTime
                }

                if (this.lastTask.timeLog[length].start === null) {
                    this.lastTask.timeLog[length].start = currentTime
                }
                this.save()
                console.log(this.taskStack)
            },
            onTaskEnd(id) {
                let currentTime = +new Date()
                let length = this.lastTask.timeLog.length - 1
                if (this.lastTask.timeLog[length].end === null) {
                    this.lastTask.timeLog[length].end = currentTime
                }
                this.taskList.unshift(this.lastTask)
                this.taskStack.shift()

                if (this.lastTask) {
                    this.lastTask.timeLog.push({
                        start: currentTime,
                        end: null
                    })
                }

                this.save()
                console.log(this.taskStack)
            },
            onTaskDelete(id) {
                this.taskStack.shift()

                if (this.lastTask) {
                    this.lastTask.timeLog.push({
                        start: currentTime,
                        end: null
                    })
                }
            },
            onTaskListDelete(row) {
                let index = this.taskList.indexOf(row)
                this.taskList.splice(index, 1)
            },
            getStartTime(timeLog) {
                return timeLog.length > 0 && timeLog[0].hasOwnProperty('start')
                    ? scope.row.timeLog[0].start
                    : ''
            },
            getDuration(row, col) {
                let timeRange = row.timeLog.map((item) => {
                    return (+item.end - (+item.start))
                });
                let timeLength = timeRange.reduce((pre, cur) => {
                    return pre + cur
                }, 0);

                return (+timeLength / 1000 / 3600).toFixed(2)
            },
            getDateString(val) {
                debugger
                let datetime = new Date(val)
                // return val ? datetime.toISOString().split('.')[0].replace('T', ' ') : ''
                return val ? fecha.format(datetime, 'MM-dd HH:mm') : ''
            },
            save() {
                localStorage.setItem('taskStack', JSON.stringify(this.taskStack))
                localStorage.setItem('taskList', JSON.stringify(this.taskList))
            },
            load() {
                let taskStack = localStorage.getItem('taskStack')
                let taskList = localStorage.getItem('taskList')
                if (taskStack && taskList) {
                    this.taskStack = JSON.parse(localStorage.getItem('taskStack'))
                    this.taskList = JSON.parse(localStorage.getItem('taskList'))
                }
            }
        }
    })
})(window)


