import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-500">
      <Card className="w-full max-w-md border border-red-900 text-center">
        <CardHeader>
          <h1 className="text-3xl font-bold">Hoş Geldiniz</h1>
          <p className="text-gray-600">Lütfen bir seçenek seçin:</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={() => navigate("/login")}>
            Giriş Yap
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => navigate("/signup")}
          >
            Kayıt Ol
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;
