interface FooterProps {
  universityName?: string;
}

export function Footer({ universityName = "Capella University" }: FooterProps) {
  return (
    <footer className="border-t border-border bg-muted/20 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4" data-testid="footer-university-name">{universityName}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Empowering students to achieve their educational and career goals through innovative programs.
            </p>
            <div className="text-sm text-muted-foreground">
              <div data-testid="footer-phone">1-800-CAPELLA</div>
              <div data-testid="footer-email">info@capella.edu</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">Programs</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-bachelors">Bachelor's Degrees</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-masters">Master's Degrees</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-doctoral">Doctoral Programs</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-certificates">Certificates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-admissions">Admissions</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-financial-aid">Financial Aid</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-career-services">Career Services</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-student-success">Student Success</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-accreditation">Accreditation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-faculty">Faculty</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-alumni">Alumni</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="footer-contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p data-testid="footer-copyright">© 2024 {universityName}. All rights reserved. | Privacy Policy | Terms of Use</p>
        </div>
      </div>
    </footer>
  );
}
