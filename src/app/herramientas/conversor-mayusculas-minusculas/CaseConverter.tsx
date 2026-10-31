'use client';

import { useState, useId } from 'react';
import { CopyButton } from '@/components/ToolComponents';
import { type CaseMode, transformText } from '@/lib/case';

interface CaseOption {
  id: CaseMode;
  name: string;
  badge: string;
  description: string;
}

const CASE_OPTIONS: CaseOption[] = [
  {
    id: 'upper',
    name: 'MAYÚSCULAS',
    badge: 'MAYÚSCULAS',
    description: 'Todo el texto en caracteres mayúsculos',
  },
  {
    id: 'lower',
    name: 'minúsculas',
    badge: 'minúsculas',
    description: 'Todo el texto en caracteres minúsculos',
  },
  {
    id: 'sentence',
    name: 'Capitalizar Oraciones',
    badge: 'Oración',
    description: 'Primera letra de cada frase en mayúscula',
  },
  {
    id: 'title',
    name: 'Title Case (Cada Palabra)',
    badge: 'Título',
    description: 'Primera letra de cada palabra en mayúscula',
  },
  {
    id: 'alternating',
    name: 'aLtErNaDo',
    badge: 'aLtErNaDo',
    description: 'Alterna mayúsculas y minúsculas letra por letra',
  },
  {
    id: 'toggle',
    name: 'Invertir Mayús / Minús',
    badge: 'iNVERTIR',
    description: 'Invierte las mayúsculas a minúsculas y viceversa',
  },
  {
    id: 'kebab',
    name: 'kebab-case',
    badge: 'kebab-case',
    description: 'Formato de URL y CSS separado por guiones',
  },
  {
    id: 'snake',
    name: 'snake_case',
    badge: 'snake_case',
    description: 'Identificadores separados por guiones bajos',
  },
  {
    id: 'camel',
    name: 'camelCase',
    badge: 'camelCase',
    description: 'Notación de variables de programación',
  },
  {
    id: 'reverse',
    name: 'Texto al revés',
    badge: 'séver lA',
    description: 'Invierte el orden de todos los caracteres',
  },
];

const SAMPLES = [
  {
    label: 'Mayúsculas accidentales',
    text: 'HOLA A TODOS, ESCRIBÍ ESTE CORREO ELECTRÓNICO CON EL BLOQUEO DE MAYÚSCULAS ACTIVADO SIN DARME CUENTA. ¿PODRÍAS CONVERTIRLO A ORACIONES NORMALES?',
  },
  {
    label: 'Título de artículo web',
    text: 'guía completa de ciberseguridad y herramientas criptográficas para desarrolladores web en 2026',
  },
  {
    label: 'Texto para URL / Slug',
    text: 'Los 10 mejores consejos para optimizar el rendimiento en Next.js y React',
  },
  {
    label: 'Frases múltiples sin puntuación',
    text: 'este es el primer párrafo. ¿sabías que esta herramienta funciona en tu navegador? ¡lo que escribes no se envía a ningún servidor!',
  },
];

export default function CaseConverter() {
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState<CaseMode>('upper');
  const inputId = useId();
  const outputId = useId();

  const outputText = transformText(inputText, activeMode);

  const inputChars = inputText.length;
  const inputWords = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;

  const outputChars = outputText.length;
  const outputWords = outputText.trim() === '' ? 0 : outputText.trim().split(/\s+/).length;

  const handleApplyToInput = () => {
    setInputText(outputText);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Transformation Selector Buttons */}
      <div className="border border-card-border rounded-xl bg-card p-4 sm:p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center justify-between">
          <span>Selecciona el formato de conversión</span>
          <span className="text-xs font-normal text-muted">
            10 transformaciones instantáneas
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {CASE_OPTIONS.map(opt => {
            const isSelected = activeMode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveMode(opt.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-accent bg-accent text-white shadow-sm'
                    : 'border-card-border bg-background text-foreground hover:border-accent/50 hover:bg-card'
                }`}
                title={opt.description}
              >
                <span className="truncate max-w-full font-bold">{opt.badge}</span>
                <span
                  className={`text-[10px] mt-0.5 truncate max-w-full ${
                    isSelected ? 'text-white/80' : 'text-muted'
                  }`}
                >
                  {opt.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main dual-panel editor: Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="border border-card-border rounded-xl bg-card p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <label htmlFor={inputId} className="text-sm font-semibold text-foreground">
                Texto original
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="px-2 py-1 text-xs font-medium rounded border border-card-border bg-background text-muted hover:text-foreground transition-colors"
                  title="Pegar del portapapeles"
                >
                  Pegar
                </button>
                {inputText && (
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="px-2 py-1 text-xs font-medium rounded border border-card-border text-danger hover:bg-danger-light transition-colors"
                    title="Borrar entrada"
                  >
                    Borrar
                  </button>
                )}
              </div>
            </div>

            <textarea
              id={inputId}
              rows={8}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Escribe o pega aquí el texto que deseas transformar a mayúsculas, minúsculas, título, oraciones..."
              className="w-full resize-y rounded-lg border border-input-border bg-background p-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none transition-colors text-sm leading-relaxed"
              autoFocus
            />
          </div>

          <div className="mt-3 pt-3 border-t border-card-border flex items-center justify-between text-xs text-muted">
            <span>
              {inputChars} caracteres · {inputWords} palabras
            </span>
          </div>
        </div>

        {/* Output Panel */}
        <div className="border border-card-border rounded-xl bg-card p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <label htmlFor={outputId} className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span>Resultado:</span>
                <span className="text-xs px-2 py-0.5 rounded font-bold bg-accent-light text-accent">
                  {CASE_OPTIONS.find(c => c.id === activeMode)?.name}
                </span>
              </label>
              <div className="flex items-center gap-1.5">
                <CopyButton text={outputText} label="Copiar resultado" />
                {outputText && (
                  <button
                    type="button"
                    onClick={handleApplyToInput}
                    className="px-2 py-1 text-xs font-medium rounded border border-card-border bg-background text-muted hover:text-foreground transition-colors"
                    title="Reemplazar texto original con este resultado"
                  >
                    Usar como entrada
                  </button>
                )}
              </div>
            </div>

            <textarea
              id={outputId}
              rows={8}
              readOnly
              value={outputText}
              placeholder="El texto convertido aparecerá aquí automáticamente al escribir..."
              className="w-full resize-y rounded-lg border border-input-border bg-code-bg p-3 text-foreground font-sans focus:outline-none text-sm leading-relaxed"
            />
          </div>

          <div className="mt-3 pt-3 border-t border-card-border flex items-center justify-between text-xs text-muted">
            <span>
              {outputChars} caracteres · {outputWords} palabras
            </span>
            <span className="text-accent font-medium">100% en tu navegador</span>
          </div>
        </div>
      </div>

      {/* Examples Bar */}
      <div className="border border-card-border rounded-xl bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted mr-1">Probar con ejemplos:</span>
          {SAMPLES.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInputText(sample.text)}
              className="text-xs px-3 py-1.5 rounded-md bg-background border border-card-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
