var size = 0;
var counter = 0;

$('.loading').hide();
$('.modal-container').hide();

eel.expose(loading);
function loading(s) {
    s ? $('.loading').show() : $('.loading').hide();
}

$('.item').click(function(){
    let mode = '';

    if(!$(this).hasClass('active')) {
        $('.item').removeClass('active');
        $(this).addClass('active');

        mode = $(this).attr('mode');

        $('.content').hide();
        $(`#${mode}`).show();

        mode==='kill' && runningProcess();
        mode==='uninstall' && installedProgram();
    }
})

$('.help').click(function(){
    $('#help').show();
})

$('.about').click(function(){
    $('#about').show();
})

$('.modal .header i').click(function(){
    $('.modal-container').hide();
})

$('.modal-container').click(function(){
    $('.modal-container').hide();
})

$('#process-refresh').click(function() {
    runningProcess();
})

$('#program-refresh').click(function() {
    installedProgram();
})

$('#verify').click(function() {
    $('#delete').hide();
    eel.verify_dir();
})

$('#delete').click(function() {
    $('#verify').hide();
    eel.remove_trash();
})

eel.expose(changeLabel)
function changeLabel(text) {
    $('#label').text(text);
}

eel.expose(changeButtonLabel)
function changeButtonLabel(text) {
    $('#verify span').text(text);
}

eel.expose(appendSize);
function appendSize(value) {
    size += value;
    let text;
    if(size>=1073741824) {
        text = `${(size/1073741824).toFixed(2)}Gb de lixo encontrado`;
    } else if(size>=1048576) {
        text = `${(size/1048576).toFixed(2)}Mb de lixo encontrado`;
    } else if(size>=1024) {
        text = `${(size/1024).toFixed(2)}Kb de lixo encontrado`;
    } else {
        text = `${(size).toFixed(2)}Bytes de lixo encontrado`;
    }

    $('#size').text(text);
}

eel.expose(startVerify);
function startVerify() {
    document.documentElement.style.setProperty('--progress-gradient', 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #4c00db, #8a2be2)');
    document.documentElement.style.setProperty('--progress-label', '#4c00db');
    size = 0;
    counter = 0;
    $('#size').text('');
    $('#label').text('');
    $('.circular img').hide('slow');
    $('#verify').attr('disabled', true);
    $('#verify').addClass('verifying');
    $('#verify').html('<i class="fa fa-circle-o-notch fa-spin"></i> <span>Iniciando...</span>');
    $('#size').show();
    $('#label').show();
}

eel.expose(finishVerify);
function finishVerify() {
    $('#verify').attr('disabled', false);
    $('#verify').html('<i class="fa fa-play"></i> Verificar Novamente');
    $('#verify').removeClass('verifying');
    $('#label').hide();
    $('#label').text('');
    $('.circular img').show('slow');
    $('.circle .left .progress').css({
        transform: `rotate(0deg)`
    })
    $('.circle .right .progress').css({
        transform: `rotate(0deg)`
    })
    document.querySelector(".number").textContent = '0%';
    $('#delete').slideDown('slow');  
}

eel.expose(startDelete);
function startDelete() {
    document.documentElement.style.setProperty('--progress-gradient', 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #420b0b, #cf0000)');
    document.documentElement.style.setProperty('--progress-label', '#8f1919');
    $('#delete').attr('disabled', true);
    $('#delete').addClass('verifying');
    $('.circular img').hide('slow');
    $('#size').hide();
    $('#delete').html('<i class="fa fa-circle-o-notch fa-spin"></i> <span>Removendo Lixo...</span>');
    $('#label').show('');
}

eel.expose(finishDelete);
function finishDelete() {
    $('#delete').attr('disabled', false);
    $('#delete').removeClass('verifying');
    $('#label').hide();
    $('#label').text('');
    const text = $('#size').text();
    $('#size').text(text.replace('encontrado', 'removido'));
    $('#size').show();
    $('.circular img').show('slow');
    $('.circle .left .progress').css({
        transform: `rotate(0deg)`
    })
    $('.circle .right .progress').css({
        transform: `rotate(0deg)`
    })
    document.querySelector(".number").textContent = '0%';
    $('#delete').html('<i class="fa fa-trash"></i> Deletar');
    $('#delete').hide();
    $('#verify').slideDown('slow');
}

eel.expose(updateProgress);
function updateProgress(progress) {
    const numb = document.querySelector(".number");
    progress > 100 && (progress = 100);
    console.log(progress);
    if(progress<=50) {
        $('.circle .left .progress').css({
            transform: `rotate(${progress*3.6}deg)`
        })
    } else {
        $('.circle .left .progress').css({
            transform: `rotate(180deg)`
        });
        
        $('.circle .right .progress').css({
            transform: `rotate(${(progress-50)*3.6}deg)`
        });
    }

    numb.textContent = progress + "%";
}

eel.expose(runningProcess);
function runningProcess() {
    $('.process-list').empty();
    eel.listProcess();
}

eel.expose(addProcess);
function addProcess(title) {
    let process = `<div class="process" id=${title}>
                    <div class="process-title">${title}</div>
                    <div class="process-icon"><i class="fa fa-trash"></i></div>
                   </div>`;

    $('.process-list').append(process);
}

$("body").on("click", ".process-icon", function(){
    let title = $(this).prev().html();
    eel.killProcess(title);
});

$("body").on("click", ".program-icon", function(){
    let title = $(this).prev().html();
    eel.uninstallProgram(title);
});

eel.expose(removeFromList);
function removeFromList(title) {
    document.getElementById(title).remove();
}

eel.expose(removeProgramFromList);
function removeProgramFromList(title) {
    let elem = $(`div:contains(${title})`);
    elem[3].remove();
}

eel.expose(installedProgram);
function installedProgram() {
    $('.program-list').empty();
    eel.listProgram();
}

eel.expose(addProgram);
function addProgram(title) {
    let program = `<div class="process">
                    <div class="process-title">${title}</div>
                    <div class="program-icon"><i class="fa fa-trash"></i></div>
                   </div>`;

    $('.program-list').append(program);
}

eel.expose(notificate);
function notificate(color, message) {
    $('.notification-deck').append(`
        <div class="notification ${color}">${message}</div>
    `).delay(3500).queue(function() {
        $('.notification-deck').children().first().fadeOut(400, function() {
            $(this).remove();
        });
        $(this).dequeue();
    });
}