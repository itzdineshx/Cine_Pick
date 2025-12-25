import { useState, useRef } from "react";
import { ArrowLeft, Download, Share2, Trophy, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type Movie } from "@/services/tmdb";
import BattleMovieSelector from "@/components/BattleMovieSelector";
import BattleResult from "@/components/BattleResult";
import { BattleService, type DetailedMovieData, type ComparisonMetrics } from "@/services/battle-service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Battle = () => {
  const { toast } = useToast();
  const [movie1, setMovie1] = useState<Movie | null>(null);
  const [movie2, setMovie2] = useState<Movie | null>(null);
  const [winner, setWinner] = useState<Movie | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detailedData1, setDetailedData1] = useState<DetailedMovieData | undefined>();
  const [detailedData2, setDetailedData2] = useState<DetailedMovieData | undefined>();
  const [metrics, setMetrics] = useState<ComparisonMetrics | undefined>();
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

  const handleBattle = async () => {
    if (!movie1 || !movie2) return;
    
    setIsProcessing(true);
    
    try {
      toast({
        title: "Analyzing movies...",
        description: "Fetching detailed data from TMDb, IMDb and comparing metrics",
      });

      // Fetch detailed data for both movies
      const [data1, data2] = await Promise.all([
        BattleService.fetchDetailedMovieData(movie1.id),
        BattleService.fetchDetailedMovieData(movie2.id)
      ]);

      setDetailedData1(data1);
      setDetailedData2(data2);

      // Calculate comparison metrics
      const comparisonMetrics = BattleService.compareMovies(movie1, movie2, data1, data2);
      setMetrics(comparisonMetrics);

      // Determine winner algorithmically based on metrics
      const algorithmicWinner = BattleService.determineWinner(movie1, movie2, data1, data2);
      setWinner(algorithmicWinner);
      setShowResult(true);

      toast({
        title: "Battle Complete!",
        description: `${algorithmicWinner.title} wins based on comprehensive analysis!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch movie data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current || !movie1 || !movie2) return;
    
    try {
      toast({
        title: "Generating image...",
        description: "Please wait while we create your battle result",
      });

      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      
      const link = document.createElement('a');
      const fileName = `cinepick-battle-${movie1.title.replace(/[^a-z0-9]/gi, '-')}-vs-${movie2.title.replace(/[^a-z0-9]/gi, '-')}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Success!",
        description: "Battle result downloaded as image",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!resultRef.current || !movie1 || !movie2) return;
    
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we create your battle result",
      });

      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const fileName = `cinepick-battle-${movie1.title.replace(/[^a-z0-9]/gi, '-')}-vs-${movie2.title.replace(/[^a-z0-9]/gi, '-')}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Success!",
        description: "Battle result downloaded as PDF",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!movie1 || !movie2 || !winner) return;

    const shareUrl = `${window.location.origin}/battle?m1=${movie1.id}&m2=${movie2.id}&winner=${winner.id}`;
    const shareText = `🎬 CinePick Battle: ${movie1.title} vs ${movie2.title}\n🏆 Winner: ${winner.title}!\n\nCompare your favorite movies on CinePick!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CinePick Battle Result',
          text: shareText,
          url: shareUrl,
        });
        toast({
          title: "Shared!",
          description: "Battle result shared successfully",
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
    setDetailedData1(undefined);
    setDetailedData2(undefined);
    setMetrics(undefined);
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
                detailedData1={detailedData1}
                detailedData2={detailedData2}
                metrics={metrics}
              />
            </div>
          )}

          {/* Action Buttons */}
          {movie1 && movie2 && !showResult && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleBattle}
                disabled={isProcessing}
                size="lg"
                className="bg-gradient-to-r from-cinema-gold to-cinema-gold/90 text-background hover:from-cinema-gold/90 hover:to-cinema-gold font-semibold px-12 py-6 text-lg"
              >
                <Swords className="w-6 h-6 mr-3" />
                {isProcessing ? "Analyzing & Comparing..." : "Start Battle"}
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
