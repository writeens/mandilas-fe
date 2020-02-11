const meetModal = document.querySelector('#meetModal')
const meetModalClose = document.querySelector('#meetModalClose');
const meetTeamItems = document.querySelectorAll('.meet-team-item');
const meetModalName = document.querySelector('#meet-modal-name');
const meetModalDesc = document.querySelector('.meet-modal-desc')
const meetModalContentRight = document.querySelector('.meet-modal-content-right')
const meetModalTitle = document.querySelector('#meet-modal-title');
const meetModalImage = document.querySelector('#meet-modal-image');
const handleTeamMemberClick = (elem) => {
    let id = elem.getAttribute('data-team-member-id')
    let data = TEAM[id]
    const {imageLocation, name, title, paragraph} = data
    meetModalName.innerHTML = name;
    meetModalTitle.innerHTML = title;
    meetModalImage.src = imageLocation;
    meetModalDesc.innerHTML = ""
    paragraph.map(item => {
        let para = document.createElement('p');
        para.setAttribute('class', 'meet-paragraph')
        para.innerHTML = item
        meetModalDesc.append(para)
    })
    meetModal.style.display = 'flex';
}
meetTeamItems.forEach(item => {
    item.addEventListener('click', () => {handleTeamMemberClick(item)})
})

//Close Modal
meetModalClose.addEventListener('click', () => {
    meetModal.style.display = 'none';
})