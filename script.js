const files = []

const canvas = document.createElement('canvas')

function dragover(e) {
	e.preventDefault()
}

function drop(e) {
	e.preventDefault()
	files.splice(0)
	if (e.dataTransfer.items?.length) {
		[...e.dataTransfer.items].forEach(el => {
			if (el.kind = `file`) readFile(el.getAsFile())
		})
	} else if (e.dataTransfer.files?.length) {
		[...e.dataTransfer.files].forEach(el => {
			readFile(el)
		})
	}
}

function readFile(file) {
	if (!/image/i.test(file.type)) return
	const img = new Image()
	const reader = new FileReader()
	reader.onload = e => {
		if (!e?.target?.result) return
		img.onload = () => {
			files.push({img: img, name: file.name})
			refresh()
		}
		img.src = e.target.result
	}
	reader.readAsDataURL(file)
}

function refresh() {
	const section = document.querySelector('section')
	section.innerHTML = null
	files.sort((a, b) => a.name.localeCompare(b.name)).forEach(el => {
		const div = document.createElement('div')
		div.innerHTML = `<span class="material-symbols-rounded">image</span><span>${el.name}</span>`
		section.appendChild(div)
	})
}

function convert() {
	if (!files?.length) return
	try {
		canvas.width = 2480
		canvas.height = files.length * 3508
		const ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		files.sort((a, b) => a.name.localeCompare(b.name)).forEach((el, i) => {
			ctx.drawImage(el.img, 0, 0, el.img.naturalWidth, el.img.naturalHeight, 0, i * 3508, 2480, 3508)
		})
		html2pdf().set({
			jsPDF: {
				filename: 'merged_files',
				compres: true,
				unit: 'px',
				format: [2480, 3508],
				pagebreak: { mode: 'avoid-all' }
			}
		}).from(canvas).save()
	} catch(e) {
		alert('Erro')
	}
}

function init() {
	document.querySelector('button').onclick = () => convert()
	document.querySelector('section').ondragover = (e) => dragover(e)
	document.querySelector('section').ondrop = (e) => drop(e)
}

document.onreadystatechange = () => {
	if (document.readyState == 'complete') init()
}