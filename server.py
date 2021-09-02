import eel, os, time, string, math

eel.init('web')

@eel.expose
def temp_files():
    eel.verifyMode('true')
    available_drives = ['%s:' % d for d in string.ascii_uppercase if os.path.exists('%s:' % d)]
    drives = ', '.join(available_drives)
    eel.changeLabel('Encontrados discos: '+drives)
    time.sleep(3)
    folderpaths = ['/TEMP/', '/$RECYCLE.BIN/']
    trash = []
    progress = 0
    for disk in available_drives:
        max_progress = 50/len(available_drives)
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
    
    eel.updateProgress(50)
    progress = 50

    eel.changeButtonLabel('Removendo Lixo...')
    time.sleep(1)
    remove_progress = 50/len(trash)
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
        time.sleep(0.1)
    
    eel.updateProgress(100)
    eel.verifyMode('')

eel.start('index.html', mode='chrome',
                        size=(750, 480),
                        disable_cache=True,
                        cmdline_args=[
                            '--incognito',
                            '--disable-sync',
                            '--disable-background-mode',
                            '--disable-translate'
                        ]
)