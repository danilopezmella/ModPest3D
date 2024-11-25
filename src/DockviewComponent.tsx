import { DockviewReact, DockviewReadyEvent,
    IDockviewPanelProps,
    IDockviewPanelHeaderProps,
 } from 'dockview-react';
import "./styles/dockview.css";
import "./styles/custom-tabs.css";
import "./styles/top-menu.css";
import { useRef,useState } from "react";
import Icon from "./Icon"; // Ajusta la ruta según la ubicación real de Icon.jsx
import logoIcon from './assets/icons/logo-icon.png'; // Ruta al ícono del logo

//import { hide } from '@tauri-apps/api/app';


function TerminalPanel(_props: IDockviewPanelProps<{ title: string; }>) {
    const [output, setOutput] = useState<string[]>(["Welcome to the terminal!"]);
    const [input, setInput] = useState<string>("");

    const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const command = input.trim();
            setOutput((prev) => [...prev, `> ${command}`]);

            // Simula la ejecución del comando
            if (command === "clear") {
                setOutput([]);
            } else if (command === "help") {
                setOutput((prev) => [
                    ...prev,
                    "Available commands:",
                    "  clear - Clear the terminal",
                    "  help - Show this help message",
                ]);
            } else {
                setOutput((prev) => [...prev, `Command not found: ${command}`]);
            }

            setInput(""); // Limpia el campo de entrada
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#1e1e1e",
                color: "#00ff00",
                height: "80%",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    flex: 1,
                    overflow: "auto",
                    fontFamily: "monospace",
                    marginBottom: "10px",
                }}
            >
                {output.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                style={{
                    backgroundColor: "black",
                    color: "white",
                    border: "none",
                    fontFamily: "monospace",
                    padding: "5px",
                }}
                placeholder="Type a command..." />
        </div>
    );
}


const components = {
    default: (props: IDockviewPanelProps<{ title: string; x?: number }>) => {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'Black',
                    height: '100%',
                }}
            >
                <span>{`Component ${props.params.title.replace('Window', '')}`}</span>
                {props.params.x && <span>{`  ${props.params.x}`}</span>}
            </div>
        );
    },
    
    tree: (props: IDockviewPanelProps<{ title: string; x?: number }>) => {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'Black',
                    height: '100%',
                }}
            >
                <span>{`${props.params.title}`}</span>
                {props.params.x && <span>{`  ${props.params.x}`}</span>}
            </div>
        );
    },
    terminal: TerminalPanel, // Componente de terminal
};

const DockviewComponent = () => {
    const dockviewRef = useRef<any>(null);
    const [panelCounter, setPanelCounter] = useState(3); // Contador para paneles
    const [panelCounterTerminal, setPanelCounterTerminal] = useState(2); // Contador para paneles
    
    const tabComponents = {
        default: (props: IDockviewPanelHeaderProps<{ title: string }>) => {
            return (
                <div className="my-custom-tab">
    <span>{props.params.title}</span>
    <div className="button-group">
        <button onClick={handleClose}>
            <Icon name="close"  className="icon-button" />
        </button>
        <button onClick={handleMinimize}>
            <Icon name="minus"  className="icon-button" />
        </button>
        <button onClick={handleMaximize}>
            <Icon name="maximize"  className="icon-button"/>
        </button>
    </div>
</div>
            );
        },
        
        tabComponentTerminal: (props: IDockviewPanelHeaderProps<{ title: string }>) => {
            return (
                <div className="my-custom-tab">
                    <span>{props.params.title}</span>
                    <button onClick={handleClose}>
            <Icon name="close" />
        </button>
                    
                </div>
            );
        },
        tabComponentInitial : (props: IDockviewPanelHeaderProps<{ title: string }>) => {
            return (
                <div className="my-custom-tab">
                    <span>{props.params.title}</span>
                    <span style={{ flexGrow: 0 }} />
                </div>
            );
        },
        tabComponentWindow : (props: IDockviewPanelHeaderProps<{ title: string }>) => {
            return (
                <div className="my-custom-tab">
                    <span>{props.params.title}</span>
                    <span style={{ flexGrow: 0 }} />
                    <button onClick={handleMaximize}>
            <Icon name="maximize" />
        </button>
        <button onClick={handleMinimize}>
            <Icon name="minus" />
        </button>
                </div>
            );
        }

    };


    const handleAddPanel = () => {
        const dockview = dockviewRef.current;
        const panelId = `Window ${panelCounter}`; // ID correlativo
        const existingPanel = dockview.getPanel("panel_2");
        if (existingPanel) {
            existingPanel.group?.focus();
            dockviewRef.current.addPanel({
            id: panelId,
            component: "default",
            tabComponent: 'default',
            //maximumWidth: 1200,
            //maximumSize: 1200,
            params: {
                title:`${panelId}`,
        },
        });
        } else {
            dockviewRef.current.addPanel({
            id: panelId,
            component: "default",
            tabComponent: "default",
            params: {
                title:`${panelId}`,
        },
        });
        }
        setPanelCounter((prev) => prev + 1); // Incrementa el contador
      };

    const handleAddPanelTerminal = () => {
        const dockview = dockviewRef.current;
        if (!dockview) {
            console.error("dockviewRef.current no está inicializado.");
            return;
        }
        // Encuentra el panel con ID 'panel_3'
        const existingPanel = dockview.getPanel("terminal_panel");
        existingPanel.focus();
        if (existingPanel) {
            console.log("Terminal panel already exists.");
            // Podrías activarlo o maximizarlo aquí
            dockviewRef.current.addPanel({
                id: `Terminal-${panelCounterTerminal}`,
                component: "terminal",
                tabComponent: 'tabComponentTerminal',
                params: {
                  title:`Terminal ${panelCounterTerminal}`,
               // position: { direction: "below" },
                },
                //borders: { enabled: true, side: "all" },
              });
        
        } else {
            console.log("Adding new terminal panel.");
            dockview.addPanel({
                id: "terminal_panel",
                component: "terminal",
                tabComponent: "tabComponentTerminal",
                params: { title: "Terminal" },
              position: { direction: "below" },
            });
        }
        setPanelCounterTerminal((prev) => prev + 1); // Incrementa el contador
      };


    const handleMaximize = () => {
        const activeGroup = dockviewRef.current?.activeGroup;
    
        if (activeGroup) {
            if (!dockviewRef.current.hasMaximizedGroup()) {
                const panel = activeGroup.panels[0];
                if (panel) {
                    dockviewRef.current.maximizeGroup(panel);
                    console.log("Grupo maximizado:", activeGroup);
                } else {
                    console.warn("No se encontró un panel en el grupo activo para maximizar.");
                }
            } else {
                console.warn("Ya hay un grupo maximizado.");
            }
        } else {
            console.warn("No se encontró un grupo activo para maximizar.");
        }
    };
    
    const handleMinimize = () => {
        if (dockviewRef.current?.hasMaximizedGroup()) {
            dockviewRef.current.exitMaximizedGroup();
            console.log("Grupo restaurado desde el estado maximizado.");
        } else {
            console.warn("No hay un grupo maximizado para minimizar.");
        }
    };
    const handleClose = () => {
        const dockview = dockviewRef.current;
    
        if (!dockview) {
            console.error("dockviewRef.current no está inicializado.");
            return;
        }
    
        const activePanel = dockview.activePanel;
    
        if (activePanel && activePanel.id && activePanel.group) {
            dockview.removePanel(activePanel);
            console.log("Panel eliminado con éxito:", activePanel);
        } else {
            console.error(
                "No se puede cerrar el panel. Razones posibles: no hay un panel activo, el panel no tiene un ID o no pertenece a un grupo."
            );
            console.log("Estado actual del activePanel:", activePanel);
        }
    };
    

    const onReady = (event: DockviewReadyEvent) => {
        // Registrar vistas personalizadas (componentes para cada panel)
        dockviewRef.current = event.api;
          // Configurar layout inicial estilo VS Code
    
        event.api.addPanel({
            id: 'panel_1',
            component: 'default',
            tabComponent: 'tabComponentInitial',
            params: {
                title: 'Tree View',
            },
            position: {direction : 'left'},     
            maximumWidth: 200,
        });

        event.api.addPanel({
            id: 'panel_2',
            component: 'default',
            tabComponent: 'tabComponentWindow',
            params: {
                title: 'View',
            },
            position: {direction : 'right'},
           // initialWidth: 1200,
            //initialHeight: 1200, 
        });

        event.api.addPanel({
            id: 'terminal_panel',
            component: 'terminal',
            tabComponent: 'tabComponentInitial',
            params: {
                title: 'Terminal 1',
            },
            position: {direction : 'below'},
            initialHeight: 200, 
        });


        // Escuchar cambios en el grupo activo
    event.api.onDidActiveGroupChange((activeGroup) => {
        console.log("Active group changed:", activeGroup);
    });
        

        // También puedes agregar más paneles aquí
    }
    
    

    return (
        <div style={{ height: "100vh", width: "100vw", backgroundColor: "#f5f5f5" }}>
        {/* Botones de control */}
        <div className="header">
    <div className="branding">
    <img src={logoIcon} alt="Logo" className="logo-icon" />
        <span className="branding-text">ModPest3D</span>
    </div>
    <button className="header-buttons" onClick={handleAddPanel}>
        New Window
    </button>
    <button className="header-buttons" onClick={handleAddPanelTerminal}>
        New Terminal
    </button>
</div>





       <div style={{ height: "calc(100vh - 50px)", width: "100%", overflow: "hidden"}}>
            <DockviewReact
             className="dockview-theme-replit"
                components={components}
                onReady={onReady}
                tabComponents={tabComponents}
                singleTabMode="fullwidth"
                hideBorders= {false}
            />
        </div>
        </div>
    );
};

export default DockviewComponent;
