import { useState, useRef } from "react";
import { ArrowLeft, Download, Share2, Trophy, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { discoverMovies, type Movie } from "@/services/tmdb";
import BattleMovieSelector from "@/components/BattleMovieSelector";
import BattleResult from "@/components/BattleResult";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Battle = () => {
  const { toast } = useToast();
  const [movie1, setMovie1] = useState<Movie | null>(null);
  const [movie2, setMovie2] = useState<Movie | null>(null);
  const [winner, setWinner] = useState<Movie | null>(null);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleMovieSelect = (movieNumber: 1 | 2, movie: Movie) => {
    if (movieNumber === 1) {
      setMovie1(movie);
    } else {
      setMovie2(movie);
    }
    setShowResult(false);
    setWinner(null);
  };

  const handleBattle = (selectedWinner: Movie) => {
    setWinner(selectedWinner);
    setShowResult(true);
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;
    
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#000000',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `cinepick-battle-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Success!",
        description: "Battle result downloaded as image",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;
    
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#000000',
        scale: 2,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`cinepick-battle-${Date.now()}.pdf`);
      
      toast({
        title: "Success!",
        description: "Battle result downloaded as PDF",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/battle?m1=${movie1?.id}&m2=${movie2?.id}&winner=${winner?.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CinePick Battle Result',
          text: `${winner?.title} wins the battle!`,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          await copyToClipboard(shareUrl);
        }
      }
    } else {
      await copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Link Copied!",
        description: "Battle result link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setMovie1(null);
    setMovie2(null);
    setWinner(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="text-foreground hover:text-primary"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-3">
              <Swords className="w-6 h-6 sm:w-8 sm:h-8 text-cinema-gold" />
              <span className="font-cinema text-xl sm:text-2xl text-primary">
                Battle Mode
              </span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Title Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="font-cinema text-4xl sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-cinema-gold to-cinema-gold/80 mb-4">
              Movie Battle Arena
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Choose two movies and decide which one deserves to be watched!
            </p>
          </div>

          {/* Battle Selection */}
          {!showResult ? (
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <BattleMovieSelector
                movieNumber={1}
                selectedMovie={movie1}
                onMovieSelect={handleMovieSelect}
              />
              
              <div className="relative flex items-center justify-center lg:hidden">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cinema-gold/20" />
                </div>
                <div className="relative bg-background px-4">
                  <Swords className="w-8 h-8 text-cinema-gold" />
                </div>
              </div>

              <BattleMovieSelector
                movieNumber={2}
                selectedMovie={movie2}
                onMovieSelect={handleMovieSelect}
              />
            </div>
          ) : (
            <div ref={resultRef}>
              <BattleResult
                movie1={movie1!}
                movie2={movie2!}
                winner={winner!}
              />
            </div>
          )}

          {/* Action Buttons */}
          {movie1 && movie2 && !showResult && (
            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={() => handleBattle(movie1)}
                className="bg-gradient-to-r from-cinema-gold to-cinema-gold/90 text-background hover:from-cinema-gold/90 hover:to-cinema-gold font-semibold px-8"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Choose {movie1.title}
              </Button>
              <Button
                onClick={() => handleBattle(movie2)}
                className="bg-gradient-to-r from-cinema-gold to-cinema-gold/90 text-background hover:from-cinema-gold/90 hover:to-cinema-gold font-semibold px-8"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Choose {movie2.title}
              </Button>
            </div>
          )}

          {showResult && (
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button
                onClick={handleDownloadImage}
                className="bg-gradient-to-r from-cinema-gold to-cinema-gold/90 text-background hover:from-cinema-gold/90 hover:to-cinema-gold"
              >
                <Download className="w-5 h-5 mr-2" />
                Download as Image
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-cinema-gold to-cinema-gold/90 text-background hover:from-cinema-gold/90 hover:to-cinema-gold"
              >
                <Download className="w-5 h-5 mr-2" />
                Download as PDF
              </Button>
              <Button
                onClick={handleShare}
                className="bg-gradient-to-r from-cinema-gold to-cinema-gold/90 text-background hover:from-cinema-gold/90 hover:to-cinema-gold"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Link
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-cinema-gold text-cinema-gold hover:bg-cinema-gold/10"
              >
                New Battle
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Battle;
