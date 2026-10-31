import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad — Cifra',
  description:
    'Información detallada sobre el tratamiento de datos personales, cookies, publicidad y procesamiento local en el navegador en Cifra.',
  alternates: {
    canonical: 'https://cifra.tools/privacidad',
  },
};

export default function PrivacidadPage() {
  return (
    <main className="flex-1 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-xs text-muted">Última actualización: 21 de octubre de 2026</p>

        <div className="mt-8 space-y-6 text-sm text-foreground/90 leading-relaxed">
          <section className="p-4 rounded-lg bg-card border border-card-border">
            <h2 className="text-base font-bold text-foreground mb-2">1. Responsable del Tratamiento</h2>
            <p className="text-muted text-xs leading-relaxed">
              En cumplimiento del Reglamento General de Protección de Datos (RGPD UE 2016/679) y la
              Ley Orgánica 3/2018 (LOPDGDD), se informa al usuario de que el titular y responsable
              del tratamiento de este sitio web es:
            </p>
            <ul className="mt-2 text-xs text-muted space-y-1 font-mono">
              <li>• Titular / Responsable: Equipo de Cifra tools</li>
              <li>• NIF/CIF: ****</li>
              <li>• Domicilio / Ubicación: ****</li>
              <li>• Correo electrónico de contacto: cifra.tools1@gmail.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">
              2. Principio Fundamental: Procesamiento Local en el Cliente
            </h2>
            <p className="text-muted leading-relaxed">
              La arquitectura técnica de Cifra está diseñada para proteger por diseño la privacidad
              de los usuarios (<em>Privacy by Design</em>).
            </p>
            <p className="text-muted leading-relaxed mt-2">
              Las operaciones de cálculo, conversión y transformación de datos realizadas en
              nuestras herramientas (incluyendo calculadoras de subredes, generador de contraseñas,
              generador de hashes, codificadores Base64 y formateador JSON) se ejecutan{' '}
              <strong>íntegramente en la CPU del dispositivo del usuario</strong> mediante
              JavaScript en el navegador. En ningún caso las entradas introducidas por el usuario
              (textos, claves o valores numéricos) son transmitidas, procesadas o guardadas en
              servidores externos o propios de Cifra.
            </p>
            <p className="text-muted leading-relaxed mt-2">
              Lo que introduces en las herramientas no se guarda ni se envía; solo se guardan
              preferencias técnicas en tu navegador (tema visual, consentimiento de cookies,
              herramientas favoritas, recientes y preferencias de interfaz en localStorage).
              Si el usuario acepta a través del banner de consentimiento, el sitio podrá usar Google
              Analytics y Google AdSense (cookies de terceros para estadísticas agregadas y publicidad
              contextual), tal como se detalla en nuestra{' '}
              <Link href="/cookies" className="text-accent underline">
                Política de Cookies
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">
              3. Datos Recopilados Automáticamente (Archivos de Registro)
            </h2>
            <p className="text-muted leading-relaxed">
              Al acceder a nuestro sitio web, los servidores de alojamiento (red de distribución de
              contenidos CDN) registran de forma temporal datos técnicos anónimos en archivos de
              registro del servidor (dirección IP anonimizada, fecha y hora de la petición, tipo y
              versión del navegador, sistema operativo y URL de procedencia). Estos datos se utilizan
              exclusivamente para garantizar la seguridad del sistema y prevenir ataques de denegación
              de servicio (DDoS), bajo el interés legítimo del responsable (Art. 6.1.f RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">
              4. Publicidad Programática y Google AdSense
            </h2>
            <p className="text-muted leading-relaxed">
              Este sitio web utiliza o tiene prevista la integración de servicios publicitarios
              proporcionados por <strong>Google LLC (Google AdSense)</strong>.
            </p>
            <ul className="list-disc pl-5 text-muted space-y-2 mt-2">
              <li>
                Google y sus socios publicitarios pueden utilizar cookies y balizas web para servir
                anuncios basados en las visitas previas del usuario a este sitio web o a otros sitios
                de internet.
              </li>
              <li>
                Los usuarios pueden inhabilitar la publicidad personalizada a través de la{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline"
                >
                  Configuración de anuncios de Google
                </a>
                .
              </li>
              <li>
                Para usuarios residentes en el Espacio Económico Europeo (EEE), Reino Unido y Suiza,
                el sitio proporciona un sistema de gestión del consentimiento previo que permite aceptar,
                rechazar o configurar de manera individualizada las cookies de medición y publicitarias.
                Una vez habilitada la monetización activa con Google AdSense, se integrará la plataforma
                de gestión de consentimiento (CMP) certificada exigida por las políticas de consentimiento
                de Google para el EEE y Reino Unido.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">5. Derechos del Usuario</h2>
            <p className="text-muted leading-relaxed">
              Cualquier usuario puede ejercer sus derechos de acceso, rectificación, supresión,
              limitación del tratamiento, portabilidad y oposición contactando a través de la
              dirección indicada en el punto 1. Dado que este sitio no recopila datos de cuentas ni
              asocia historiales a personas identificadas, el ejercicio de estos derechos se limitará
              a los datos que obren en registros técnicos si fuese técnicamente posible su
              identificación.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
