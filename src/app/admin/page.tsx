import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Edit, Home, Mail, Settings, Image as ImageIcon, BarChart, LogOut, Printer, GalleryHorizontal, Component, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const adminLinks = [
  {
    href: "/admin/artworks",
    title: "Værker",
    description: "Se og rediger status, pris, beskrivelser m.m. for alle værker.",
    icon: <Edit className="h-5 w-5 text-muted-foreground" />
  },
  {
    href: "/admin/edit-content/home",
    title: "Forside",
    description: "Rediger tekster og billeder på forsiden.",
    icon: <Home className="h-5 w-5 text-muted-foreground" />
  },
   {
    href: "/admin/edit-content/gallery",
    title: "Galleri-side",
    description: "Rediger tekster på galleri-siden.",
    icon: <GalleryHorizontal className="h-5 w-5 text-muted-foreground" />
  },
   {
    href: "/admin/edit-content/lagersalg",
    title: "Lagersalg Indstillinger",
    description: "Aktiver/deaktiver lagersalg-siden og rediger menupunkt og sidetekster.",
    icon: <Component className="h-5 w-5 text-muted-foreground" />
  },
  {
    href: "/admin/edit-content/about",
    title: "Om Os-side",
    description: "Rediger tekster og billeder for begge kunstnere på 'Om Os'-siden.",
    icon: <Users className="h-5 w-5 text-muted-foreground" />
  },
  {
    href: "/admin/edit-content/exhibitions",
    title: "Udstillinger-side",
    description: "Rediger galleri-samarbejder og billeder fra udstillinger.",
    icon: <ImageIcon className="h-5 w-5 text-muted-foreground" />
  },
  {
    href: "/admin/edit-content/kalender",
    title: "Kalender",
    description: "Administrer kommende begivenheder og udstillinger i kalenderen.",
    icon: <Calendar className="h-5 w-5 text-muted-foreground" />
  },
  {
    href: "/admin/edit-content/contact",
    title: "Kontakt side",
    description: "Rediger email, telefon, adresse og CVR-nummer.",
    icon: <Mail className="h-5 w-5 text-muted-foreground" />
  },
   {
    href: "/admin/edit-content/footer",
    title: "Footer",
    description: "Rediger copyright tekst og sociale medier links.",
    icon: <Settings className="h-5 w-5 text-muted-foreground" />
  },
  {
    href: "/admin/edit-content/seo",
    title: "SEO & Indstillinger",
    description: "Administrer sidetitler, meta-beskrivelser og tracking-scripts (f.eks. Google Analytics).",
    icon: <BarChart className="h-5 w-5 text-muted-foreground" />
  }
]


export default async function AdminPage() {

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-headline">Administration</h1>
        <p className="text-muted-foreground">Vælg et område du vil redigere.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminLinks.sort((a,b) => a.title.localeCompare(b.title)).map(link => (
          <Link href={link.href} key={link.href}>
            <Card className="hover:border-primary hover:shadow-md transition-all h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {link.title}
                  {link.icon}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {link.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
