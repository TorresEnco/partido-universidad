import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { representatives } from "@/data/representatives";
import RepresentativeModal from "./RepresentativeModal";

const AUTOPLAY_INTERVAL = 5000;

export default function RepresentativesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRep, setSelectedRep] = useState<typeof representatives[number] | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrentIndex((index + representatives.length) % representatives.length);
  }, []);

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  useEffect(() => {
    if (isPaused || isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, isHovered, goNext]);

  const openModal = (rep: typeof representatives[number]) => {
    setSelectedRep(rep);
    setModalOpen(true);
    setIsPaused(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setIsPaused(false);
  };

  const getCardStyles = (index: number) => {
    const offset = ((index - currentIndex) % 3 + 3) % 3;
    const isCenter = offset === 0;
    const isRight = offset === 1;

    return {
      transform: `translateY(-50%) translateX(${isCenter ? "0" : isRight ? "var(--side-offset)" : "calc(-1 * var(--side-offset))"}) scale(${isCenter ? 1 : 0.8})`,
      transformOrigin: "center",
      opacity: isCenter ? 1 : 0.5,
      zIndex: isCenter ? 30 : 20,
    };
  };

  return (
    <section id="equipo" className="relative overflow-hidden border-t border-border/40 bg-gradient-to-b from-sky-50/60 via-teal-50/20 to-sky-50/40 dark:from-zinc-950/20 dark:via-zinc-950/40 dark:to-zinc-950/20">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-4 pb-4 sm:pt-10 sm:pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            La fórmula del cambio
          </h2>
          <p className="mt-4 text-muted-foreground">
            Estudiantes y docentes comprometidos con la transformación universitaria. Haz clic en cada perfil para conocer sus propuestas.
          </p>
        </div>

        <div
          className="relative mt-4 sm:mt-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Responsive offset variable: larger separation on wider screens */}          <div className="relative mx-auto h-[420px] max-w-[810px] xs:h-[440px] sm:h-[540px] sm:max-w-[900px] lg:h-[580px] lg:max-w-[990px] xl:max-w-[1200px] [--side-offset:46%] sm:[--side-offset:67%] md:[--side-offset:87%] lg:[--side-offset:113%] xl:[--side-offset:133%]">
            {representatives.map((rep, i) => {
              const styles = getCardStyles(i);
              const isCenter = ((i - currentIndex) % 3 + 3) % 3 === 0;

              return (
                <button
                  key={rep.id}
                  onClick={() => (isCenter ? openModal(rep) : goTo(i))}
                  className="absolute top-1/2 left-1/2 -ml-[89px] w-[178px] cursor-pointer text-left focus-visible:outline-none transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] sm:-ml-[117px] sm:w-[234px] md:-ml-[130px] md:w-[261px] lg:-ml-[144px] lg:w-[288px] xl:-ml-[157px] xl:w-[315px]"
                  style={styles}
                >
                  <div className="group relative flex flex-col justify-end aspect-[3/4.4] w-full overflow-hidden rounded-[2rem] border-2 border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.06)] dark:border-zinc-800 transition-shadow duration-500 hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]">
                    {/* Background image */}
                    <img
                      src={rep.photo}
                      alt={rep.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 -z-20 brightness-[1.08] contrast-[1.01]"
                    />

                    {/* Dark gradient overlay (lighter at the top, darker at the bottom) */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    {/* Text container with a subtle lens blur and no hard borders */}
                    <div className="relative z-10 w-full p-4 pb-5 sm:p-5 sm:pb-6 text-left backdrop-blur-[2px]">
                      <h3 className="font-heading text-sm font-bold tracking-tight text-white sm:text-base md:text-lg lg:text-xl text-left">
                        {rep.shortName}
                      </h3>

                      {/* Línea de acento azul */}
                      <div className="mt-2 h-[3px] w-7 rounded-full bg-blue-500" />

                      {/* Cargo / Rol */}
                      <p className="mt-2.5 text-[10px] font-semibold leading-normal text-zinc-200 sm:text-xs md:text-sm">
                        {rep.badge}
                      </p>

                      {isCenter && (
                        <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-blue-300 sm:text-xs">
                          <span>Ver perfil</span>
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={goPrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              {representatives.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-border hover:bg-muted-foreground/30"
                  }`}
                  aria-label={`Ir a representante ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <RepresentativeModal
        representative={selectedRep}
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      />
    </section>
  );
}
