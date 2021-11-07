import eel, os, time, string, math, winshell

eel.init('web')

trash = []

@eel.expose
def verify_dir():
    global trash
    trash = []
    progress = 0

    eel.startVerify()
    available_drives = ['%s:' % d for d in string.ascii_uppercase if os.path.exists('%s:' % d)]
    drives = ', '.join(available_drives)
    eel.changeLabel('Encontrados discos: '+drives)

    time.sleep(3)
    folderpaths = ['/TEMP/', '/$RECYCLE.BIN/']
    for disk in available_drives:
        max_progress = 100/len(available_drives)
        eel.changeButtonLabel('Verificando '+disk)
        time.sleep(1.5)

        for Folderpath in folderpaths:
            progress += max_progress/len(folderpaths)
            eel.updateProgress(math.floor(progress))

            if os.path.exists(disk+Folderpath):
                for ele in os.scandir(disk+Folderpath):
                    eel.changeLabel(os.path.basename(ele))
                    eel.appendSize(os.path.getsize(ele))
                    time.sleep(0.08)
                    trash.append(os.path.abspath(ele))
    
    eel.updateProgress(100)
    eel.finishVerify()

@eel.expose
def remove_trash():
    eel.startDelete()
    global trash
    progress = 0
    time.sleep(1)
    remove_progress = 100/len(trash)
    for t in trash:
        progress += remove_progress
        eel.updateProgress(math.floor(progress))
        eel.changeLabel(t)
        try:
            os.remove(t)
        except:
            try:
                os.removedirs(t)
            except:
                pass
            pass
        time.sleep(0.1)
    
    try:
        winshell.recycle_bin().empty(confirm=False, show_progress=False, sound=False)
    except:
        pass

    eel.updateProgress(100)
    eel.finishDelete()

@eel.expose
def listProcess():
    result = []
    whitelist = ['python.exe', 'chrome.exe', 'server.exe']
    process = os.popen('wmic process where "not ExecutablePath like \'C:\\\Windows%\'" get name').read()
    process = process.split('\n')
    process.pop(0)
    for i in process:
        this = i.replace(' ', '')
        if this not in result and this.endswith('.exe') and this not in whitelist:
            result.append(this)
  
    result = list(filter(None, result))
    
    for p in result:
        eel.addProcess(p)
    
    eel.notificate('green', 'Lista Atualizada')

@eel.expose
def killProcess(title):
    exit_code = os.popen(f'taskkill /im {title} /f').read()
    if not exit_code:
        eel.notificate('red', f'Erro ao remover {title}, atualizando a lista.')
        eel.runningProcess()
    else:
        eel.removeFromList(title)
        eel.notificate('green', f'{title} removido com sucesso!')

@eel.expose
def listProgram():
    eel.loading(True)
    result = []
    program = os.popen('wmic product get Name').read()
    program = program.split('\n')
    program.pop(0)
    for i in program:
        this = i.strip()
        if this not in result:
            result.append(this)
  
    result = list(filter(None, result))
    
    for p in result:
        eel.addProgram(p)
    
    eel.loading()
    eel.notificate('green', 'Lista Atualizada')

@eel.expose
def uninstallProgram(title):
    eel.loading(True)

    exit_code = os.popen(f'wmic product where "name like \'{title}\'" call uninstall /nointeractive').read()
    print(exit_code)
    if not exit_code:
        eel.notificate('red', f'Erro ao desinstalar {title}, atualizando a lista.')
    else:
        eel.removeProgramFromList(title)
        eel.notificate('green', f'{title} desinstalado com sucesso!')

    eel.loading()


eel.start('index.html', mode='chrome',
                        size=(900, 600),
                        disable_cache=True,
                        cmdline_args=[
                            '--disable-sync',
                            '--disable-background-mode',
                            '--disable-translate'
                        ]
)