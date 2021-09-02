var size = 0;
var counter = 0;

$('#verify').click(function() {
    size = 0;
    counter = 0;
    $('#size').text('');
    eel.temp_files();
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

eel.expose(verifyMode);
function verifyMode(enabled) {
    if(enabled) {
        $('.circular img').hide('slow');
        $('#verify').attr('disabled', true);
        $('#verify').addClass('verifying');
        $('#verify').html('<i class="fa fa-circle-o-notch fa-spin"></i> <span>Iniciando...</span>');
        $('#size').show();
        $('#label').show();
    } else {
        $('#verify').attr('disabled', false);
        $('#verify').html('Verificar');
        $('#verify').removeClass('verifying');
        $('#label').hide();
        $('.circular img').show('slow');
        $('.circle .left .progress').css({
            transform: `rotate(0deg)`
        })
        $('.circle .right .progress').css({
            transform: `rotate(0deg)`
        })
        document.querySelector(".number").textContent = '0%';
        let text = $('#size').text();
        $('#size').text(text.replace('encontrado', 'removido'));
    }
}

eel.expose(updateProgress);
function updateProgress(progress) {
    const numb = document.querySelector(".number");
    
    if(progress<=50) {
        $('.circle .left .progress').css({
            transform: `rotate(${progress*3.6}deg)`
        })
    } else {
        $('.circle .right .progress').css({
            transform: `rotate(${(progress-50)*3.6}deg)`
        })
    }

    numb.textContent = progress + "%";
}