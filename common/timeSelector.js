var yyyy = 3; //3年
function getYear() {
	const date = new Date();
	let year = date.getFullYear();
	let arr = []
	for (let i = yyyy - 1; i >= 0; i--) {
		let yr = +year - i + '年'
		arr.push(yr)
	}
	return arr
}


function getMonth() {
	const date = new Date();
	let month = date.getMonth() + 1;
	let arr = []
	for (let i = 1; i <= month; i++) {
		let mh = i + '月'
		if (i < 10) {
			mh = '0' + mh
		}
		arr.push(mh)
	}
	return arr
}


function getMonth2() {
	let arr = []
	for (let i = 1; i <= 12; i++) {
		let mh = i + '月'
		if (i < 10) {
			mh = '0' + mh
		}
		arr.push(mh)
	}
	return arr
}

export let date = [getYear(), getMonth()]

export function screeningYear(year) {

	if (year.column == 0 && year.value == yyyy - 1) {
		date = [getYear(), getMonth()]
	}
	if (year.column == 0 && year.value !== yyyy - 1) {
		date = [getYear(), getMonth2()]
	}
	return date
}

export let nowDate = getYear()[yyyy - 1] + getMonth()[getMonth().length - 1]

export let valueNow = [yyyy - 1, getMonth().length - 1]

export function determinationDate(value) {
	return nowDate = date[0][value[0]] + date[1][value[1]]

}





export function dateSelectYear() {
	let dateYear = {
		value: 0,
		label: '',
		children: []
	}
	
	let dateMonth = {
		value: 0,
		label: ''
	}
	let dateList = []
	
	
	const date = new Date();
	let year = date.getFullYear() + '年'
	let arr = getYear()
	let arr2 = getMonth()
	let arr3 = getMonth2()
	let num = 0
	
	// 年
	arr.forEach((item,value) => {
		dateYear.value = num
		dateYear.label = item
		const str = JSON.stringify(dateYear);
		dateList.unshift(JSON.parse(str))
		num++
	})
	// console.log('list',dateList)
	// console.log('num',num)
	
	// 月
	dateList.forEach((item,value) => {
		// console.log('year',item)
		if(item.label == year){
			// console.log('@@',1)
			arr2.forEach((item,value1) => {
				dateMonth.value = num
				dateMonth.label = item
				const str = JSON.stringify(dateMonth);
				dateList[value].children.push(JSON.parse(str))
				num++
			})
		}else{
			// console.log('@@',2)
			arr3.forEach((item,value2) => {
				dateMonth.value = num
				dateMonth.label = item
				const str = JSON.stringify(dateMonth);
				dateList[value].children.push(JSON.parse(str))
				num++
			})
		}
	})
	
	return dateList
}

