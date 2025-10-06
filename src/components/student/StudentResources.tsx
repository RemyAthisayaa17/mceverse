import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, Search, Video, Link as LinkIcon, File } from "lucide-react";

const StudentResources = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [filteredResources, setFilteredResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = resources.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.subject?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResources(filtered);
    } else {
      setFilteredResources(resources);
    }
  }, [searchQuery, resources]);

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from("resources")
      .select(`
        *,
        subject:subjects(name, code)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setResources(data);
      setFilteredResources(data);
    }

    setLoading(false);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="w-5 h-5 text-destructive" />;
      case "video":
        return <Video className="w-5 h-5 text-primary" />;
      case "link":
        return <LinkIcon className="w-5 h-5 text-accent" />;
      default:
        return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getFileTypeBadge = (fileType: string) => {
    const colors: any = {
      pdf: "bg-destructive/20 text-destructive border-destructive/30",
      video: "bg-primary/20 text-primary border-primary/30",
      link: "bg-accent/20 text-accent-foreground border-accent/30",
      assignment: "bg-secondary/20 text-secondary-foreground border-secondary/30",
    };

    return (
      <Badge className={`rounded-full ${colors[fileType.toLowerCase()] || "bg-muted/50"}`}>
        {fileType.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-soft rounded-2xl">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search resources by title, description, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-border/30"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-card rounded-2xl">
        <CardHeader className="border-b border-border/30 bg-gradient-secondary rounded-t-2xl">
          <CardTitle className="text-2xl text-foreground">Available Resources</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "No resources found matching your search" : "No resources available yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="bg-background/50 border-border/30 hover:shadow-hover transition-all duration-300 rounded-xl group"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getFileIcon(resource.file_type)}
                        <span className="text-sm font-semibold text-foreground">
                          {resource.subject?.name || "General"}
                        </span>
                      </div>
                      {getFileTypeBadge(resource.file_type)}
                    </div>

                    <div>
                      <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                        {resource.title}
                      </h3>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {resource.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(resource.created_at).toLocaleDateString()}
                      </span>
                      <Button
                        size="sm"
                        className="bg-gradient-card-lavender hover:opacity-90 text-white rounded-full group-hover:scale-105 transition-transform"
                        onClick={() => window.open(resource.file_url, "_blank")}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentResources;
