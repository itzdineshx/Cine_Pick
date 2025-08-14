import { ExternalLink, Database } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="card-cinema rounded-xl p-6 sm:p-8 lg:p-12 text-center">
          <h2 className="font-cinema text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary mb-6 sm:mb-8">
            About CinePick
          </h2>
          
          <div className="space-y-4 sm:space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-base sm:text-lg">
              CinePick helps you discover your next favorite movie through intelligent random recommendations. 
              Say goodbye to endless scrolling and indecision – let us find the perfect film for your mood.
            </p>
            
            <p className="text-sm sm:text-base">
              Our smart filtering system ensures you get personalized recommendations based on your preferences 
              for genre, release year, rating, and language. Each session remembers what you've already seen, 
              so you'll never get the same movie twice.
            </p>
            
            <div className="border-t border-border pt-6 sm:pt-8 mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm">
                <Database className="w-4 h-4" />
                <span>Powered by</span>
                <a 
                  href="https://www.themoviedb.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors inline-flex items-center space-x-1"
                >
                  <span>The Movie Database (TMDb)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                This product uses the TMDb API but is not endorsed or certified by TMDb.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;